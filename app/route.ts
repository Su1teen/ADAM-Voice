export const runtime = 'edge'

export const dynamic = 'force-dynamic'

export const fetchCache = 'force-no-store'

import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const conversationId = `${performance.now()}_${Math.random()}`
  
  // Get the forwarded host from Nginx, fallback to request URL
  const forwardedHost = request.headers.get('x-forwarded-host')
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'http'
  
  let redirectUrl: string
  
  if (forwardedHost) {
    // Use the forwarded host from Nginx
    redirectUrl = `${forwardedProto}://${forwardedHost}/c/${conversationId}`
  } else {
    // Fallback to request URL origin
    const url = new URL(request.url)
    redirectUrl = `${url.origin}/c/${conversationId}`
  }
  
  return NextResponse.redirect(redirectUrl)
}
