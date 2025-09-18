"use client"

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface VoiceVisualizerProps {
  isListening: boolean
  isSpeaking: boolean
  onToggle: () => void
}

export default function VoiceVisualizer({ isListening, isSpeaking, onToggle }: VoiceVisualizerProps) {
  const [bars, setBars] = useState(Array(8).fill(0))
  const [ripples, setRipples] = useState<number[]>([])

  useEffect(() => {
    if (isListening || isSpeaking) {
      const interval = setInterval(() => {
        setBars(Array(8).fill(0).map(() => Math.random() * 100))
      }, 120)
      return () => clearInterval(interval)
    } else {
      setBars(Array(8).fill(0))
    }
  }, [isListening, isSpeaking])

  const handleClick = () => {
    // Add ripple effect
    const newRipple = Date.now()
    setRipples(prev => [...prev, newRipple])
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(id => id !== newRipple))
    }, 1000)
    
    onToggle()
  }

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
      {/* Liquid Glass Voice Visualizer */}
      <div 
        className="relative cursor-pointer group"
        onClick={handleClick}
      >
        {/* Ambient glow */}
        <div className={`absolute inset-0 rounded-full transition-all duration-500 ${
          isListening || isSpeaking ? 'animate-liquid-glow-advanced' : ''
        }`} />
        
        {/* Main liquid glass circle with clean edges */}
        <motion.div
          className={`glass-circle relative w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full flex items-center justify-center transition-all duration-500 overflow-hidden ${
            isListening || isSpeaking
              ? 'border-[var(--accent)] shadow-[var(--glow-strong)] animate-liquid-glow-advanced'
              : 'group-hover:border-[var(--border-strong)]'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={isListening || isSpeaking ? {
            boxShadow: [
              '0 0 0 0px rgba(0, 122, 255, 0.4)',
              '0 0 0 20px rgba(0, 122, 255, 0)',
              '0 0 0 0px rgba(0, 122, 255, 0.4)'
            ]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {/* Advanced liquid voice bars */}
          <div className="flex items-center justify-center gap-1.5 relative z-10">
            {bars.map((height, index) => (
              <motion.div
                key={index}
                className={`w-1.5 rounded-full transition-all duration-300 ${
                  isListening || isSpeaking 
                    ? 'bg-gradient-to-t from-white via-blue-100 to-cyan-200 shadow-sm' 
                    : 'bg-gradient-to-t from-[var(--fg-secondary)] to-[var(--fg-muted)]'
                }`}
                initial={{ height: 6 }}
                animate={{ 
                  height: isListening || isSpeaking 
                    ? Math.max(6, height * 0.5) 
                    : 6,
                  opacity: isListening || isSpeaking ? 1 : 0.7,
                  filter: isListening || isSpeaking 
                    ? `blur(0px) saturate(1.2)` 
                    : `blur(0px) saturate(1)`
                }}
                transition={{ 
                  duration: 0.15,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
          
          {/* Advanced inner highlights with displacement */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/15 via-white/5 to-transparent pointer-events-none" />
          <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-[var(--accent)]/10 via-transparent to-white/8 pointer-events-none" />
        </motion.div>
        
        {/* Advanced ripple effects */}
        {ripples.map((rippleId) => (
          <motion.div
            key={rippleId}
            className="absolute inset-0 rounded-full border-2 border-[var(--accent)] pointer-events-none animate-ripple-glass-advanced"
            initial={{ scale: 0.8, opacity: 1 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        ))}
        
        {/* Continuous pulse rings when active */}
        {(isListening || isSpeaking) && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border border-[var(--accent)]/30"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border border-[var(--accent)]/20"
              initial={{ scale: 1, opacity: 0.4 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            />
          </>
        )}
      </div>

      {/* Clean status text with proper glass background */}
      <motion.div 
        className="glass-panel px-6 py-3 text-center rounded-2xl"
        animate={{
          scale: isListening || isSpeaking ? 1.02 : 1
        }}
        transition={{ duration: 0.3 }}
      >
        <p className={`text-sm font-medium transition-colors duration-300 ${
          isSpeaking 
            ? 'text-[var(--success)]' 
            : isListening 
            ? 'text-[var(--accent)]' 
            : 'text-[var(--fg-secondary)]'
        }`}>
          {getStatus()}
        </p>
      </motion.div>
    </div>
  )
}