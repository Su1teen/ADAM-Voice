'use client'

import ChatContainer from '@/components/ChatContainer'
import ChatInput from '@/components/ChatInput'
import VoiceVisualizer from '@/components/VoiceVisualizer'
import SmartHomeControl from '@/components/SmartHomeControl'
import HealthInsights from '@/components/HealthInsights'
import CustomizationPanel from '@/components/CustomizationPanel'
import { type Role, useConversation } from '@11labs/react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { MessageSquare, X, Home, Activity, Settings } from 'react-feather'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export default function ConversationPage() {
  const { slug } = useParams()
  const [messages, setMessages] = useState<Message[]>([])
  const [showChat, setShowChat] = useState(false)
  const [showSmartHome, setShowSmartHome] = useState(false)
  const [showHealthInsights, setShowHealthInsights] = useState(false)
  const [showCustomization, setShowCustomization] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  const loadConversation = () => {
    fetch(`/api/c?id=${slug}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.length > 0) {
          const formattedMessages: Message[] = res.map((item: any) => ({
            id: item.id,
            role: item.role === 'assistant' ? 'assistant' : 'user',
            content: item.content_transcript,
            timestamp: Date.now() - (res.length - item.created_at) * 1000,
          }))
          setMessages(formattedMessages)
        }
      })
      .catch((error) => {
        console.log('No conversation history found')
        setMessages([])
      })
  }

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    const newMessage: Message = {
      id: 'msg_' + Date.now() + '_' + Math.random(),
      role,
      content,
      timestamp: Date.now(),
    }
    setMessages(prev => [...prev, newMessage])
    return newMessage
  }

  const saveMessage = async (message: Message) => {
    try {
      await fetch('/api/c', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: slug,
          item: {
            type: 'message',
            status: 'completed',
            object: 'realtime.item',
            id: message.id,
            role: message.role,
            content: [{ type: 'text', transcript: message.content }],
          },
        }),
      })
    } catch (error) {
      console.error('Failed to save message:', error)
    }
  }

  const conversation = useConversation({
    onError: (error: string) => {
      console.error('Connection error:', error)
      setIsConnected(false)
    },
    onConnect: () => {
      setIsConnected(true)
    },
    onDisconnect: () => {
      setIsConnected(false)
    },
    onMessage: (props: { message: string; source: Role }) => {
      const { message, source } = props
      const role = source === 'ai' ? 'assistant' : 'user'
      const newMessage = addMessage(role, message)
      saveMessage(newMessage)
    },
  })

  const connectConversation = useCallback(async () => {
    if (isConnected) return
    
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      const response = await fetch('/api/i', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      if (data.error) {
        console.error('API Error:', data.error)
        return
      }
      await conversation.startSession({ signedUrl: data.apiKey })
    } catch (error) {
      console.error('Connection error:', error)
    }
  }, [conversation, isConnected])

  const disconnectConversation = useCallback(async () => {
    if (!isConnected) return
    await conversation.endSession()
    setIsConnected(false)
  }, [conversation, isConnected])

  const handleVoiceToggle = () => {
    console.log('Voice toggle clicked, current status:', conversation.status, 'isConnected:', isConnected)
    if (conversation.status === 'connected' || isConnected) {
      disconnectConversation()
    } else {
      connectConversation()
    }
  }

  const handleSendMessage = async (messageContent: string) => {
    // Add user message to chat immediately
    const userMessage = addMessage('user', messageContent)
    await saveMessage(userMessage)

    try {
      // Send message to text API for AI response
      const response = await fetch('/api/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageContent }),
      })
      
      const data = await response.json()
      
      if (data.response) {
        const aiMessage = addMessage('assistant', data.response)
        await saveMessage(aiMessage)
      } else {
        throw new Error(data.error || 'No response received')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = addMessage('assistant', 'Sorry, I encountered an error processing your message. Please try again.')
      await saveMessage(errorMessage)
    }
  }

  useEffect(() => {
    loadConversation()
  }, [slug])

  // Sync isConnected state with conversation status
  useEffect(() => {
    const connected = conversation.status === 'connected'
    if (connected !== isConnected) {
      setIsConnected(connected)
    }
  }, [conversation.status, isConnected])

  useEffect(() => {
    return () => {
      if (isConnected) {
        disconnectConversation()
      }
    }
  }, [slug])

  return (
    <div className="mobile-scroll-container min-h-screen relative overflow-hidden">
      {/* Advanced Liquid Glass Background */}
      <div className="fixed inset-0 -z-10">
        {/* Primary gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#0a0a0f]" />
        
        {/* Liquid Glass Orbs with Displacement Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 opacity-20">
          <div className="w-full h-full bg-gradient-to-r from-[var(--accent)] via-blue-400 to-cyan-400 rounded-full filter blur-3xl animate-liquid-flow" />
          <div className="absolute inset-0 w-full h-full bg-gradient-to-l from-purple-400 via-[var(--accent)] to-blue-500 rounded-full filter blur-2xl animate-displacement-wave" style={{animationDelay: '2s'}} />
        </div>
        
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 opacity-15">
          <div className="w-full h-full bg-gradient-to-r from-purple-400 via-[var(--accent)] to-pink-400 rounded-full filter blur-3xl animate-float-glass-advanced" />
          <div className="absolute inset-4 w-4/5 h-4/5 bg-gradient-to-br from-cyan-300 to-blue-600 rounded-full filter blur-xl animate-displacement-wave" style={{animationDelay: '4s'}} />
        </div>
        
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 opacity-10">
          <div className="w-full h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-full filter blur-3xl animate-float-glass-advanced" style={{animationDelay: '6s'}} />
        </div>
        
        {/* Additional displacement layers */}
        <div className="absolute top-3/4 left-1/6 w-48 h-48 opacity-12">
          <div className="w-full h-full bg-gradient-to-br from-blue-300 via-[var(--accent)] to-purple-500 rounded-full filter blur-2xl animate-liquid-flow" style={{animationDelay: '3s'}} />
        </div>
        
        <div className="absolute top-1/6 right-1/3 w-56 h-56 opacity-8">
          <div className="w-full h-full bg-gradient-to-tl from-indigo-400 via-blue-400 to-cyan-300 rounded-full filter blur-3xl animate-displacement-wave" style={{animationDelay: '1s'}} />
        </div>
        
        {/* Glass surface overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(255,255,255,0.01)] to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,122,255,0.03)_0%,transparent_50%)]" />
      </div>

      {/* Liquid Glass Navigation buttons */}
      <div className="fixed top-4 right-4 z-50 flex gap-3">
        <motion.button
          onClick={() => {
            setShowCustomization(!showCustomization)
            setShowChat(false)
            setShowSmartHome(false)
            setShowHealthInsights(false)
          }}
          className={`glass-button p-3 transition-all duration-300 ${
            showCustomization 
              ? 'bg-gradient-to-br from-[var(--accent)] to-[var(--accent-light)] text-white shadow-[var(--glow-glass)]' 
              : 'text-[var(--fg)]'
          }`}
          title="Настройки"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Settings size={20} />
        </motion.button>
        
        <motion.button
          onClick={() => {
            setShowSmartHome(!showSmartHome)
            setShowChat(false)
            setShowHealthInsights(false)
            setShowCustomization(false)
          }}
          className={`glass-button p-3 transition-all duration-300 ${
            showSmartHome 
              ? 'bg-gradient-to-br from-[var(--accent)] to-[var(--accent-light)] text-white shadow-[var(--glow-glass)]' 
              : 'text-[var(--fg)]'
          }`}
          title="Умный дом"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Home size={20} />
        </motion.button>
        
        <motion.button
          onClick={() => {
            setShowHealthInsights(!showHealthInsights)
            setShowChat(false)
            setShowSmartHome(false)
            setShowCustomization(false)
          }}
          className={`glass-button p-3 transition-all duration-300 ${
            showHealthInsights 
              ? 'bg-gradient-to-br from-[var(--accent)] to-[var(--accent-light)] text-white shadow-[var(--glow-glass)]' 
              : 'text-[var(--fg)]'
          }`}
          title="Здоровье и аналитика"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Activity size={20} />
        </motion.button>
        
        <motion.button
          onClick={() => {
            setShowChat(!showChat)
            setShowSmartHome(false)
            setShowHealthInsights(false)
            setShowCustomization(false)
          }}
          className={`glass-button p-3 transition-all duration-300 ${
            showChat 
              ? 'bg-gradient-to-br from-[var(--accent)] to-[var(--accent-light)] text-white shadow-[var(--glow-glass)]' 
              : 'text-[var(--fg)]'
          }`}
          title="Голосовой чат"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageSquare size={20} />
        </motion.button>
      </div>

      {/* Chat container */}
      <ChatContainer messages={messages} isVisible={showChat} />

      {/* Smart Home Control */}
      <SmartHomeControl 
        isVisible={showSmartHome} 
        onClose={() => setShowSmartHome(false)} 
      />

      {/* Health Insights */}
      <HealthInsights 
        isVisible={showHealthInsights} 
        onClose={() => setShowHealthInsights(false)} 
      />

      {/* Customization Panel */}
      <CustomizationPanel 
        isVisible={showCustomization} 
        onClose={() => setShowCustomization(false)} 
      />

      {/* Main voice interface */}
      {!showChat && !showSmartHome && !showHealthInsights && !showCustomization && (
        <motion.div 
          className="flex items-center justify-center min-h-screen p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <VoiceVisualizer
            isListening={conversation.status === 'connected' && !conversation.isSpeaking}
            isSpeaking={conversation.isSpeaking}
            onToggle={handleVoiceToggle}
          />
        </motion.div>
      )}

      {/* Chat input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        onVoiceToggle={handleVoiceToggle}
        isListening={conversation.status === 'connected'}
        disabled={false}
      />
    </div>
  )
}
