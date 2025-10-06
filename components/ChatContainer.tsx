"use client"

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ChatMessage from './ChatMessage'
import { MessageCircle } from 'react-feather'

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
          className="fixed inset-0 z-50 bg-black/70"
          onClick={() => {}} // Backdrop doesn't close chat
          style={{ willChange: 'opacity' }}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ 
              type: 'tween',
              duration: 0.3,
              ease: [0.32, 0.72, 0, 1]
            }}
            className="mobile-scroll-container absolute right-0 top-0 bottom-0 w-full max-w-md"
            style={{ 
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)'
            }}
          >
            <div className="h-full p-4">
              <div className="h-full glass-panel border-l shadow-2xl overflow-hidden rounded-3xl flex flex-col">
                {/* Header */}
                <div className="glass-surface flex items-center justify-between p-4 border-b border-[var(--border-glass)]">
                  <div className="flex items-center gap-3">
                    <MessageCircle size={24} className="text-[var(--accent)]" />
                    <h2 className="text-xl font-semibold text-[var(--fg)]">Чат с вашим ИИ</h2>
                  </div>
                </div>

                {/* Messages container */}
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-6"
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
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}