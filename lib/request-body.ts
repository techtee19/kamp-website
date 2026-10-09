export class RequestBodyTooLargeError extends Error {
  constructor() {
    super('Request body exceeds the configured limit')
    this.name = 'RequestBodyTooLargeError'
  }
}

export class InvalidRequestBodyError extends Error {
  constructor() {
    super('Request body is not valid UTF-8 JSON')
    this.name = 'InvalidRequestBodyError'
  }
}

export class UnsupportedRequestMediaTypeError extends Error {
  constructor() {
    super('Expected an application/json request')
    this.name = 'UnsupportedRequestMediaTypeError'
  }
}

export function requestBodyErrorResponse(error: unknown): { status: number; message: string } | null {
  if (error instanceof RequestBodyTooLargeError) return { status: 413, message: 'Request body is too large.' }
  if (error instanceof UnsupportedRequestMediaTypeError) return { status: 415, message: 'Unsupported request content type.' }
  if (error instanceof InvalidRequestBodyError) return { status: 400, message: 'Invalid request body.' }
  return null
}

/** Read a request incrementally so chunked requests cannot bypass Content-Length checks. */
export async function readRequestBytes(request: Request, maxBytes: number): Promise<Buffer> {
  const contentLength = request.headers.get('content-length')
  if (contentLength !== null) {
    const declaredLength = Number(contentLength)
    if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
      throw new RequestBodyTooLargeError()
    }
  }

  const reader = request.body?.getReader()
  if (!reader) return Buffer.alloc(0)

  const chunks: Uint8Array[] = []
  let totalBytes = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      totalBytes += value.byteLength
      if (totalBytes > maxBytes) {
        await reader.cancel()
        throw new RequestBodyTooLargeError()
      }
      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }

  return Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)), totalBytes)
}

export function parseJsonBytes(bytes: Uint8Array): unknown {
  const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  return JSON.parse(text) as unknown
}

export async function readJsonRequest(request: Request, maxBytes: number): Promise<unknown> {
  const mediaType = request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase()
  if (mediaType !== 'application/json') throw new UnsupportedRequestMediaTypeError()

  const bytes = await readRequestBytes(request, maxBytes)
  try {
    return parseJsonBytes(bytes)
  } catch {
    throw new InvalidRequestBodyError()
  }
}
