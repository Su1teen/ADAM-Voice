"use client"

import { motion } from 'framer-motion'
import { User, Cpu } from 'react-feather'

interface ChatMessageProps {
  message: {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp?: number
  }
  isLatest?: boolean
}

export default function ChatMessage({ message, isLatest }: ChatMessageProps) {
  const isUser = message.role === 'user'
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 p-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-[var(--accent)] text-white' 
          : 'bg-[var(--bg-tertiary)] text-[var(--fg-secondary)] border border-[var(--border)]'
      }`}>
        {isUser ? <User size={16} /> : <Cpu size={16} />}
      </div>

      {/* Message content */}
      <div className={`flex-1 max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className={`rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-[var(--accent)] text-white rounded-br-md'
            : 'bg-[var(--bg-secondary)] text-[var(--fg)] border border-[var(--border)] rounded-bl-md'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>
        
        {/* Timestamp */}
        {message.timestamp && (
          <span className="text-xs text-[var(--fg-muted)] mt-1 px-2">
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        )}
      </div>
    </motion.div>
  )
}