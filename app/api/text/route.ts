export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

// Simple text-to-speech via ElevenLabs text API
export async function POST(request: Request) {
  try {
    const { message } = await request.json()
    
    if (!message) {
      return NextResponse.json({ error: 'Missing message' }, { status: 400 })
    }

    // For now, return a simple mock response
    // In a real implementation, you would call ElevenLabs text API here
    const response = {
      response: `I received your message: \"${message}\". This is a text-based response. For voice interaction, please use the voice button.`,
      timestamp: Date.now()
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Text message error:', error)
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 })
  }
}