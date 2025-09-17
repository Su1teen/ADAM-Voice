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
          <div className="bg-[var(--bg-secondary)]/90 backdrop-blur-xl border border-[var(--border)] rounded-2xl p-3 sm:p-4 shadow-2xl">
            <div className="flex items-end gap-2 sm:gap-3">
              {/* Voice Toggle Button */}
              <button
                type="button"
                onClick={onVoiceToggle}
                className={`flex-shrink-0 p-2.5 sm:p-3 rounded-xl transition-all duration-200 ${isListening
                    ? 'bg-[var(--accent)] text-white animate-pulse-glow shadow-lg shadow-[var(--accent-glow)]'
                    : 'bg-[var(--bg-tertiary)] hover:bg-[var(--border-light)] text-[var(--fg-secondary)] hover:text-[var(--fg)]'
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

              {/* Send Button */}
              <button
                type="submit"
                disabled={!message.trim() || disabled}
                className={`flex-shrink-0 p-2.5 sm:p-3 rounded-xl transition-all duration-200 ${message.trim() && !disabled
                    ? 'bg-[var(--accent)] text-white hover:bg-[var(--accent-light)] hover:shadow-lg hover:shadow-[var(--accent-glow)] transform hover:scale-105'
                    : 'bg-[var(--bg-tertiary)] text-[var(--fg-muted)] cursor-not-allowed'
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