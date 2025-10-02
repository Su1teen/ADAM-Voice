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
          className="fixed top-0 left-0 right-0 bottom-24 md:bottom-32 pointer-events-none z-30"
        >
          <div className="h-full max-w-4xl mx-auto p-4 flex flex-col">
            {/* Professional Header */}
            <div className="flex-shrink-0 mb-4">
              <div className="glass-panel p-5 pointer-events-auto rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-apple-purple/20 to-apple-blue/20 flex items-center justify-center">
                    <motion.div
                      className="w-5 h-5 bg-gradient-to-br from-apple-purple to-apple-blue rounded-full"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.8, 1, 0.8]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                      Чат с ИИ-Ассистентом
                    </h2>
                    <p className="text-xs text-[var(--text-tertiary)]">
                      Голосовой и текстовый помощник
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages container */}
            <div 
              ref={scrollRef}
              className="mobile-scroll-container flex-1 overflow-y-auto pointer-events-auto glass-panel rounded-2xl p-4"
              style={{ scrollbarWidth: 'thin' }}
            >
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center p-8">
                  <div>
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-apple-purple/20 to-apple-blue/20 flex items-center justify-center">
                      <motion.div
                        className="w-10 h-10 bg-gradient-to-br from-apple-purple to-apple-blue rounded-full"
                        animate={{ 
                          scale: [1, 1.3, 1],
                          opacity: [0.6, 1, 0.6]
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </div>
                    <p className="text-lg font-semibold text-[var(--text-primary)] mb-2">Готов к общению</p>
                    <p className="text-sm text-[var(--text-secondary)] max-w-xs mx-auto">
                      Начните разговор, написав или проговорив сообщение
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
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