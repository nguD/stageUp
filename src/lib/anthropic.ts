const MODEL = 'claude-sonnet-4-20250514'
const MAX_TOKENS = 4096

export async function generateWithClaude(
  apiKey: string,
  userPrompt: string,
): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  })

  const data = (await res.json()) as {
    error?: { message?: string }
    content?: Array<{ type: string; text?: string }>
  }

  if (!res.ok) {
    const msg = data.error?.message ?? res.statusText
    throw new Error(msg || `Erreur API (${res.status})`)
  }

  const parts = data.content?.filter((b) => b.type === 'text' && b.text) ?? []
  return parts.map((b) => b.text).join('\n')
}
