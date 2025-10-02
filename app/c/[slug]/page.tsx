import { use } from 'react'
import ConversationClient from './ConversationClient'

export default function ConversationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  return <ConversationClient conversationId={slug} />
}