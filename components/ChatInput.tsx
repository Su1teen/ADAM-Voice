"use client"

import { useState } from 'react'
import { Send, Mic, MicOff } from 'react-feather'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  onVoiceToggle: () => void
  isListening: boolean
  disabled?: boolean
}

export default function ChatInput({ onSendMessage, onVoiceToggle, isListening, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)] to-transparent z-40">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className="glass-panel p-3 sm:p-4 shadow-2xl">
            <div className="flex items-end gap-2 sm:gap-3">
              {/* Liquid Glass Voice Toggle Button */}
              <button
                type="button"
                onClick={onVoiceToggle}
                className={`glass-button flex-shrink-0 p-2.5 sm:p-3 transition-all duration-300 ${
                  isListening
                    ? 'bg-gradient-to-br from-[var(--accent)] to-[var(--accent-light)] text-white animate-pulse-glass shadow-[var(--glow-glass)]'
                    : 'text-[var(--fg-secondary)] hover:text-[var(--fg)]'
                }`}
                disabled={disabled}
                title={isListening ? 'Остановить голосовой разговор' : 'Начать голосовой разговор'}
              >
                {isListening ? <MicOff size={18} className="sm:w-5 sm:h-5" /> : <Mic size={18} className="sm:w-5 sm:h-5" />}
              </button>

              {/* Text Input */}
              <div className="flex-1 relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Напишите сообщение или используйте голос..."
                  className="w-full bg-transparent text-[var(--fg)] placeholder-[var(--fg-muted)] resize-none outline-none min-h-[40px] sm:min-h-[48px] max-h-32 py-2.5 sm:py-3 px-0 text-sm sm:text-base"
                  disabled={disabled}
                  rows={1}
                  style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                  }}
                />
              </div>

              {/* Liquid Glass Send Button */}
              <button
                type="submit"
                disabled={!message.trim() || disabled}
                className={`glass-button flex-shrink-0 p-2.5 sm:p-3 transition-all duration-300 ${
                  message.trim() && !disabled
                    ? 'bg-gradient-to-br from-[var(--accent)] to-[var(--accent-light)] text-white hover:shadow-[var(--glow-glass)] transform hover:scale-105'
                    : 'text-[var(--fg-muted)] cursor-not-allowed opacity-50'
                }`}
                title={!message.trim() ? 'Напишите сообщение для отправки' : 'Отправить сообщение'}
              >
                <Send size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}