export const runtime = 'edge'

export const dynamic = 'force-dynamic'

export const fetchCache = 'force-no-store'

import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // Get the actual host from the request
  const url = new URL(request.url)
  const conversationId = `${performance.now()}_${Math.random()}`
  
  // Use the request's origin instead of hardcoding localhost
  return NextResponse.redirect(new URL(`/c/${conversationId}`, url.origin))
}
