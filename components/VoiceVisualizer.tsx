"use client"

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface VoiceVisualizerProps {
  isListening: boolean
  isSpeaking: boolean
  onToggle: () => void
}

export default function VoiceVisualizer({ isListening, isSpeaking, onToggle }: VoiceVisualizerProps) {
  const [bars, setBars] = useState(Array(5).fill(0))

  useEffect(() => {
    if (isListening || isSpeaking) {
      const interval = setInterval(() => {
        setBars(Array(5).fill(0).map(() => Math.random() * 100))
      }, 150)
      return () => clearInterval(interval)
    } else {
      setBars(Array(5).fill(0))
    }
  }, [isListening, isSpeaking])

  const getStatus = () => {
    if (isSpeaking) return 'ИИ говорит...'
    if (isListening) return 'Слушаю...'
    return 'Нажмите для начала голосового разговора'
  }

  const getStatusColor = () => {
    if (isSpeaking) return 'text-[var(--success)]'
    if (isListening) return 'text-[var(--accent)]'
    return 'text-[var(--fg-secondary)]'
  }

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Voice Visualizer */}
      <div 
        className="relative cursor-pointer group"
        onClick={onToggle}
      >
        {/* Outer glow ring */}
        <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
          isListening || isSpeaking ? 'animate-glow' : ''
        }`} />
        
        {/* Main circle */}
        <motion.div
          className={`relative w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full flex items-center justify-center transition-all duration-300 ${
            isListening || isSpeaking
              ? 'bg-gradient-to-br from-[var(--accent)] to-[var(--accent-light)] shadow-lg shadow-[var(--accent-glow)]'
              : 'bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] border border-[var(--border)] group-hover:border-[var(--border-light)]'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Voice bars */}
          <div className="flex items-center justify-center gap-1">
            {bars.map((height, index) => (
              <motion.div
                key={index}
                className={`w-1 rounded-full ${
                  isListening || isSpeaking ? 'bg-white' : 'bg-[var(--fg-secondary)]'
                }`}
                initial={{ height: 4 }}
                animate={{ height: isListening || isSpeaking ? Math.max(4, height * 0.4) : 4 }}
                transition={{ duration: 0.1 }}
              />
            ))}
          </div>
        </motion.div>
        
        {/* Pulse ring when active */}
        {(isListening || isSpeaking) && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-[var(--accent)]"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </div>

      {/* Status text */}
      <div className="text-center">
        <p className={`text-sm font-medium ${getStatusColor()}`}>
          {getStatus()}
        </p>
      </div>
    </div>
  )
}