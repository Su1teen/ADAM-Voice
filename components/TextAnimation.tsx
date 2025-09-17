"use client"

import { useTypingEffect } from '@/components/useTypingEffect'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

type AIState = 'Жду указании' | 'Слушаю' | '...'

interface Props {
  onStartListening?: () => void
  onStopListening?: () => void
  isAudioPlaying?: boolean
  currentText: string
}

export default function AiTalkingAnimation({ onStartListening, onStopListening, isAudioPlaying, currentText }: Props) {
  const [aiState, setAiState] = useState<AIState>('Жду указании')
  const animatedCurrentText = useTypingEffect(currentText, 20)
  const displayedText = useTypingEffect('Нажимте на кружок чтобы подключиться к ИИ агенту.', 20)

  const handleCircleClick = () => {
    if (aiState === 'Слушаю' || aiState === '...') {
      onStopListening?.()
      setAiState('Жду указании')
    } else if (!isAudioPlaying) {
      onStartListening?.()
      setAiState('Слушаю')
    }
  }

  useEffect(() => {
    if (isAudioPlaying) setAiState('...')
    else if (aiState === '...' && currentText) setAiState('Слушаю')
  }, [isAudioPlaying])

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[var(--bg)] p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-10 xl:gap-16 mx-auto max-w-6xl w-full">
        {/* Circle */}
        <div
          className="relative select-none cursor-pointer order-1 lg:order-1"
          onClick={handleCircleClick}
          role="button"
          aria-label={aiState === 'Слушаю' ? 'Stop listening' : 'Start listening'}
        >
          <motion.div
            className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-gradient-to-br from-violet-700 to-pink-700 rounded-full flex items-center justify-center shadow-xl opacity-90 border-2 border-white/30"
            animate={
              aiState === 'Жду указании'
                ? { scale: [1, 1.1, 1] }
                : aiState === '...'
                ? { scale: [1, 1.2, 0.8, 1.2, 1] }
                : {}
            }
            transition={{
              repeat: Infinity,
              ease: 'easeInOut',
              duration: aiState === '...' ? 0.8 : 1.5,
            }}
          />
          {aiState === 'Слушаю' && (
            <svg
              className="absolute top-1/2 left-1/2 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-60 lg:h-60 -translate-x-1/2 -translate-y-1/2 opacity-80"
              viewBox="0 0 100 100"
            >
              <motion.circle
                cx="50"
                cy="50"
                r="48"
                fill="none"
                strokeWidth="4"
                stroke="var(--accent)"
                transition={{
                  duration: 10,
                  ease: 'linear',
                  repeat: Infinity,
                }}
                strokeLinecap="round"
                initial={{ pathLength: 0, rotate: -90 }}
                animate={{ pathLength: 1, rotate: 270 }}
              />
            </svg>
          )}
        </div>

        {/* Text card */}
        <div className="flex-1 flex w-full order-2 lg:order-2">
          <div className="bg-[var(--card-bg)] p-4 sm:p-6 md:p-8 lg:p-10 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl w-full max-w-4xl opacity-95 border border-white/20">
            <p className="text-[var(--fg)] text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-mono font-semibold leading-relaxed" aria-live="polite">
              {aiState === 'Слушаю' ? 'Слушаю...' : aiState === '...' ? animatedCurrentText : displayedText}
            </p>
            {aiState === 'Жду указании' && (
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
                className="h-4 w-2 sm:h-5 sm:w-2.5 bg-[var(--accent)] mt-2 sm:mt-3 rounded"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
