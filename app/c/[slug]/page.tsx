import ConversationClient from '@/components/ConversationClient'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  return {
    title: 'A.D.A.M. Voice Assistant',
    description: 'Advanced voice assistant for smart home control and productivity',
  }
}

export default async function ConversationPage({ params }: PageProps) {
  const { slug } = await params
  return <ConversationClient conversationId={slug} />
}
