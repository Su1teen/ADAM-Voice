'use client'

interface ConversationProps {
  conversationId: string
}

export function Conversation({ conversationId }: ConversationProps) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">ADAM Voice Assistant</h1>
        <p className="text-gray-300 mb-8">Conversation ID: {conversationId}</p>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <p className="text-center text-gray-400">
            Voice interface will be loaded here
          </p>
          {/* Add your voice interface components here */}
        </div>
      </div>
    </div>
  )
}