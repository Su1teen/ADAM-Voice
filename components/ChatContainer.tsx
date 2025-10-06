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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed top-0 left-0 right-0 bottom-24 md:bottom-32 pointer-events-none z-30"
          style={{ willChange: 'opacity' }}
        >
          <div className="h-full max-w-4xl mx-auto p-4 pt-20 md:pt-4 flex flex-col">
            {/* Liquid Glass Header */}
            <div className="flex-shrink-0 mb-4">
              <div className="glass-panel p-4 pointer-events-auto">
                <h2 className="text-lg font-semibold text-[var(--fg)] mb-1">
                  Чат с вашим ИИ
                </h2>
                <p className="text-sm text-[var(--fg-secondary)]">
                  Общайтесь с вашим ИИ-помощником
                </p>
              </div>
            </div>

            {/* Liquid Glass Messages container */}
            <div 
              ref={scrollRef}
              className="mobile-scroll-container flex-1 overflow-y-auto pointer-events-auto glass-panel"
              style={{ scrollbarWidth: 'thin' }}
            >
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-[var(--fg-muted)] text-center p-8">
                  <div>
                    <div className="glass-circle w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-light)] rounded-full animate-pulse" />
                    </div>
                    <p className="text-lg font-medium mb-2">Готов к общению</p>
                    <p className="text-sm">Начните разговор, написав или проговорив сообщение</p>
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