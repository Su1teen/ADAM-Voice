export const runtime = 'edge'

export const dynamic = 'force-dynamic'

export const fetchCache = 'force-no-store'

import { NextResponse } from 'next/server'
import { elevenLabsConfig } from '@/elevenlabs-config'

export async function POST(request: Request) {
  let agentId = elevenLabsConfig.agentId
  let apiKey = elevenLabsConfig.apiKey
  try {
    const body = await request.json()
    if (body.apiKey) apiKey = body.apiKey
    if (body.agentId) agentId = body.agentId
  } catch (e) {}
  if (!agentId) throw Error('ELEVENLABS_AGENT_ID is not set or received.')
  if (!apiKey) throw Error('ELEVENLABS_API_KEY is not set or received.')
  try {
    const apiUrl = new URL('https://api.elevenlabs.io/v1/convai/conversation/get_signed_url')
    apiUrl.searchParams.set('agent_id', agentId)
    const response = await fetch(apiUrl.toString(), {
      headers: { 'xi-api-key': apiKey },
    })
    if (!response.ok) throw new Error(response.statusText)
    const data = await response.json()
    return NextResponse.json({ apiKey: data.signed_url })
  } catch (error) {
    // @ts-ignore
    const message = error.message || error.toString()
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
