import type { NextRequest } from 'next/server';
import { rateLimit } from '@/platform/rate-limit';

function requestIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown';
}

/** Returns true when a public endpoint may continue. */
export function allowPublicRequest(request: NextRequest, action: string, limit: number, windowSeconds: number) {
  return rateLimit(`${action}:${requestIp(request)}`, limit, windowSeconds);
}
