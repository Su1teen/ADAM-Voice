export const runtime = 'edge'

export const dynamic = 'force-dynamic'

export const fetchCache = 'force-no-store'

import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const conversationId = `${performance.now()}_${Math.random()}`
  
  // Use the request's origin to maintain the correct domain
  const redirectUrl = new URL(`/c/${conversationId}`, url.origin)
  
  return NextResponse.redirect(redirectUrl)
}