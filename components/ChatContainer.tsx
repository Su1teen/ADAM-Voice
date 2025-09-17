"use client"

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ChatMessage from './ChatMessage'

interface ChatContainerProps {
  messages: Array<{
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp?: number
  }>
  isVisible: boolean
}

export default function ChatContainer({ messages, isVisible }: ChatContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 bottom-24 md:bottom-32 pointer-events-none"
        >
          <div className="h-full max-w-4xl mx-auto p-4 flex flex-col">
            {/* Header */}
            <div className="flex-shrink-0 mb-4">
              <div className="bg-[var(--bg-secondary)]/80 backdrop-blur-xl border border-[var(--border)] rounded-2xl p-4 pointer-events-auto">
                <h2 className="text-lg font-semibold text-[var(--fg)] mb-1">
                  Voice Conversation
                </h2>
                <p className="text-sm text-[var(--fg-secondary)]">
                  Chat or speak with your AI assistant
                </p>
              </div>
            </div>

            {/* Messages container */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto pointer-events-auto bg-[var(--bg-secondary)]/60 backdrop-blur-xl border border-[var(--border)] rounded-2xl"
              style={{ scrollbarWidth: 'thin' }}
            >
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-[var(--fg-muted)] text-center p-8">
                  <div>
                    <div className="w-16 h-16 mx-auto mb-4 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center">
                      <motion.div
                        className="w-8 h-8 bg-[var(--accent)] rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                    <p className="text-lg font-medium mb-2">Ready to chat</p>
                    <p className="text-sm">Start a conversation by typing or speaking</p>
                  </div>
                </div>
              ) : (
                <div className="py-2">
                  {messages.map((message, index) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      isLatest={index === messages.length - 1}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}