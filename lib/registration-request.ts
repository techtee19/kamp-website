/** Retry only operations whose server-side keys make a repeat safe. */
export async function registrationRequest(path: string, init: RequestInit, retry = false) {
  const attempts = retry ? 2 : 1
  for (let attempt = 0; attempt < attempts; attempt++) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 25_000)
    try {
      const response = await fetch(path, { ...init, signal: controller.signal })
      if (attempt + 1 === attempts || ![408, 500, 502, 503, 504].includes(response.status)) return response
      await response.body?.cancel()
    } catch (error) {
      if (attempt + 1 === attempts) throw error
    } finally {
      clearTimeout(timeout)
    }
    await new Promise((resolve) => setTimeout(resolve, 350))
  }
  throw new Error('No registration response')
}
