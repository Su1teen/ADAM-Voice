export const runtime = 'edge'

export const dynamic = 'force-dynamic'

export const fetchCache = 'force-no-store'

import { NextResponse } from 'next/server'

// In-memory storage for messages (will be lost on server restart)
const messageStore = new Map<string, any[]>()

export async function POST(request: Request) {
  const { id, item } = await request.json()
  if (!id || !item) return NextResponse.json({}, { status: 400 })
  
  // Get existing messages for this session or create new array
  const existingMessages = messageStore.get(id) || []
  
  // Add the new message
  const newMessage = {
    created_at: existingMessages.length,
    id: item.id,
    session_id: id,
    content_type: item.content[0].type,
    content_transcript: item.content[0].transcript,
    object: item.object,
    role: item.role,
    status: item.status,
    type: item.type,
  }
  
  existingMessages.push(newMessage)
  messageStore.set(id, existingMessages)
  
  return NextResponse.json({})
}

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get('id')
  if (!id) return NextResponse.json([])
  
  // Return messages for this session from memory
  const messages = messageStore.get(id) || []
  return NextResponse.json(messages)
}
