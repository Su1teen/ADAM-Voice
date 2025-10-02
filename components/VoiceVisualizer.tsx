"use client"

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface VoiceVisualizerProps {
  isListening: boolean
  isSpeaking: boolean
  onToggle: () => void
}

export default function VoiceVisualizer({ isListening, isSpeaking, onToggle }: VoiceVisualizerProps) {
  const [bars, setBars] = useState(Array(12).fill(0))
  const [ripples, setRipples] = useState<number[]>([])

  
  useEffect(() => {
    if (isListening || isSpeaking) {
      const interval = setInterval(() => {
        setBars(Array(12).fill(0).map(() => Math.random() * 100))
      }, 100)
      return () => clearInterval(interval)
    } else {
      setBars(Array(12).fill(0))
    }
  }, [isListening, isSpeaking])

  const handleClick = () => {
    const newRipple = Date.now()
    setRipples(prev => [...prev, newRipple])
    setTimeout(() => {
      setRipples(prev => prev.filter(id => id !== newRipple))
    }, 800)
    onToggle()
  }

  const getStatus = () => {
    if (isSpeaking) return 'ИИ говорит...'
    if (isListening) return 'Слушаю...'
    return 'Нажмите, чтобы начать голосовой разговор'
  }

  const getStatusColor = () => {
    if (isSpeaking) return 'text-apple-green'
    if (isListening) return 'text-apple-blue'
    return 'text-[var(--text-secondary)]'
  }

  return (
    <div className="flex flex-col items-center gap-10">
      {/* Professional Apple Voice Visualizer */}
      <div 
        className="relative cursor-pointer group"
        onClick={handleClick}
      >
        {/* Outer glow effect */}
        {(isListening || isSpeaking) && (
          <motion.div
            className="absolute inset-[-20px] rounded-full"
            style={{
              background: `radial-gradient(circle, ${
                isSpeaking ? 'rgba(48, 209, 88, 0.15)' : 'rgba(10, 132, 255, 0.15)'
              } 0%, transparent 70%)`
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.7, 0.5]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        
        {/* Main liquid glass circle */}
        <motion.div
          className={`glass-circle relative w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 rounded-full flex items-center justify-center transition-all duration-500 ${
            isListening || isSpeaking ? 'active' : ''
          }`}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          {/* Professional voice bars (Apple style) */}
          <div className="flex items-center justify-center gap-1.5 relative z-10">
            {bars.map((height, index) => (
              <motion.div
                key={index}
                className={`w-1 rounded-full transition-colors duration-300 ${
                  isListening || isSpeaking 
                    ? isSpeaking
                      ? 'bg-gradient-to-t from-apple-green/80 to-apple-green'
                      : 'bg-gradient-to-t from-apple-blue/80 to-apple-blue'
                    : 'bg-[var(--text-tertiary)]'
                }`}
                initial={{ height: 4 }}
                animate={{ 
                  height: isListening || isSpeaking 
                    ? Math.max(4, height * 0.45) 
                    : 4,
                  opacity: isListening || isSpeaking ? 1 : 0.5
                }}
                transition={{ 
                  duration: 0.12,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        </motion.div>
        
        {/* Ripple effects on tap */}
        {ripples.map((rippleId) => (
          <motion.div
            key={rippleId}
            className={`absolute inset-0 rounded-full border ${
              isSpeaking ? 'border-apple-green/40' : 'border-apple-blue/40'
            } pointer-events-none`}
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        ))}
        
        {/* Continuous pulse rings when active */}
        {(isListening || isSpeaking) && (
          <>
            <motion.div
              className={`absolute inset-0 rounded-full border ${
                isSpeaking ? 'border-apple-green/20' : 'border-apple-blue/20'
              }`}
              animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className={`absolute inset-0 rounded-full border ${
                isSpeaking ? 'border-apple-green/15' : 'border-apple-blue/15'
              }`}
              animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            />
          </>
        )}
      </div>

      {/* Professional status text */}
      <motion.div 
        className="glass-card px-8 py-4 text-center"
        animate={{
          scale: isListening || isSpeaking ? 1.02 : 1
        }}
        transition={{ duration: 0.3, type: "spring" }}
      >
        <motion.p 
          className={`text-[15px] font-medium transition-colors duration-300 ${getStatusColor()}`}
          animate={{
            opacity: [1, 0.85, 1]
          }}
          transition={{ 
            duration: isListening || isSpeaking ? 2 : 0, 
            repeat: isListening || isSpeaking ? Infinity : 0
          }}
        >
          {getStatus()}
        </motion.p>
        {(isListening || isSpeaking) && (
          <motion.div 
            className="flex justify-center gap-1 mt-2"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${
                  isSpeaking ? 'bg-apple-green' : 'bg-apple-blue'
                }`}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}