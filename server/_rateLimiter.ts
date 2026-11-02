export interface RateLimitResult {
  allowed: boolean
  remaining: number
  limit: number
  reset: number
  store: 'persistent-kv' | 'ephemeral-memory'
}

// In-process fallback cache for single instances/local testing
const memoryStore = new Map<string, { count: number; resetTime: number }>()

/**
 * Multi-instance rate limiting for Vercel.
 * When KV_REST_API_URL & KV_REST_API_TOKEN or UPSTASH_REDIS_REST_URL & UPSTASH_REDIS_REST_TOKEN
 * are present, uses distributed persistent storage. Otherwise uses an ephemeral memory fallback
 * and flags the response header.
 */
export async function checkRateLimit(
  ip: string,
  limit: number = 20,
  windowSeconds: number = 60
): Promise<RateLimitResult> {
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  const now = Date.now()

  if (kvUrl && kvToken) {
    try {
      const sanitizedIp = ip.replace(/[^a-zA-Z0-9_.-]/g, '_')
      const key = `ratelimit:avela:${sanitizedIp}`
      const res = await fetch(`${kvUrl}/pipeline`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${kvToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([
          ['INCR', key],
          ['EXPIRE', key, windowSeconds]
        ]),
        signal: AbortSignal.timeout(2000)
      })

      if (res.ok) {
        const data = (await res.json()) as Array<{ result: number }>
        const count = data[0]?.result || 1
        const remaining = Math.max(0, limit - count)
        const allowed = count <= limit
        return {
          allowed,
          remaining,
          limit,
          reset: Math.floor(now / 1000) + windowSeconds,
          store: 'persistent-kv'
        }
      }
    } catch {
      // Graceful fallback if external KV temporarily unreachable
    }
  }

  // Ephemeral memory fallback for local dev or single instances
  const record = memoryStore.get(ip)
  if (!record || now > record.resetTime) {
    const resetTime = now + windowSeconds * 1000
    memoryStore.set(ip, { count: 1, resetTime })
    return {
      allowed: true,
      remaining: limit - 1,
      limit,
      reset: Math.floor(resetTime / 1000),
      store: 'ephemeral-memory'
    }
  }

  record.count += 1
  const remaining = Math.max(0, limit - record.count)
  return {
    allowed: record.count <= limit,
    remaining,
    limit,
    reset: Math.floor(record.resetTime / 1000),
    store: 'ephemeral-memory'
  }
}
