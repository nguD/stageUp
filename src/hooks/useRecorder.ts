import { useCallback, useEffect, useRef, useState } from 'react'

export type RecorderStatus = 'idle' | 'recording' | 'error'

export function useRecorder() {
  const [status, setStatus] = useState<RecorderStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const startedAtRef = useRef<number>(0)

  const stopTracks = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }, [])

  const start = useCallback(async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : ''
      const rec = mime
        ? new MediaRecorder(stream, { mimeType: mime })
        : new MediaRecorder(stream)
      mediaRecorderRef.current = rec
      chunksRef.current = []
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      rec.start()
      startedAtRef.current = Date.now()
      setStatus('recording')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Microphone inaccessible')
      setStatus('error')
    }
  }, [])

  const stop = useCallback(async (): Promise<{ blob: Blob; durationSeconds: number } | null> => {
    const rec = mediaRecorderRef.current
    if (!rec || rec.state === 'inactive') {
      stopTracks()
      setStatus('idle')
      return null
    }
    const durationSeconds = Math.max(
      1,
      Math.round((Date.now() - startedAtRef.current) / 1000),
    )
    return new Promise((resolve) => {
      rec.onstop = () => {
        const mime = rec.mimeType || 'audio/webm'
        const blob = new Blob(chunksRef.current, { type: mime })
        mediaRecorderRef.current = null
        stopTracks()
        setStatus('idle')
        resolve({ blob, durationSeconds })
      }
      rec.stop()
    })
  }, [stopTracks])

  useEffect(
    () => () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
      }
      stopTracks()
    },
    [stopTracks],
  )

  const resetError = useCallback(() => {
    setError(null)
    setStatus('idle')
  }, [])

  return { status, error, start, stop, resetError }
}
