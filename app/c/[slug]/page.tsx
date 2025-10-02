'use client'

import ChatContainer from '@/components/ChatContainer'
import ChatInput from '@/components/ChatInput'
import VoiceVisualizer from '@/components/VoiceVisualizer'
import SmartHomeControl from '@/components/SmartHomeControl'
import ProductivityHealth from '@/components/ProductivityHealth'
import CustomizationPanel from '@/components/CustomizationPanel'
import BuildingAutomation from '@/components/BuildingAutomation'
import { type Role, useConversation } from '@11labs/react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { MessageSquare, X, Home, Activity, Settings, Layers } from 'react-feather'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export default function ConversationPage() {
  const params = useParams()
  const slug = typeof params.slug === 'string' ? params.slug : Array.isArray(params.slug) ? params.slug[0] : ''
  const [messages, setMessages] = useState<Message[]>([])
  const [showChat, setShowChat] = useState(false)
  const [showSmartHome, setShowSmartHome] = useState(false)
  const [showHealthInsights, setShowHealthInsights] = useState(false)
  const [showCustomization, setShowCustomization] = useState(false)
  const [showBuildingAutomation, setShowBuildingAutomation] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  const loadConversation = () => {
    if (!slug) return
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
    if (!slug) return
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
    if (slug) {
      loadConversation()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className="mobile-scroll-container min-h-screen relative overflow-hidden bg-[var(--bg-primary)]">
      {/* Professional Apple Liquid Glass Background */}
      <div className="fixed inset-0 -z-10">
        {/* Deep black gradient base */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#000000] via-[#0a0a0a] to-[#000000]" />
        
        {/* Ultra-refined Liquid Glass Orbs (Apple Style) */}
        <div className="liquid-orb liquid-orb-blue absolute top-[20%] left-[15%] w-[500px] h-[500px] animate-liquid-flow" />
        <div className="liquid-orb liquid-orb-purple absolute bottom-[15%] right-[20%] w-[400px] h-[400px] animate-liquid-pulse" style={{animationDelay: '2s'}} />
        <div className="liquid-orb liquid-orb-teal absolute top-[50%] left-[50%] w-[300px] h-[300px] animate-float-subtle" style={{animationDelay: '4s'}} />
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-[rgba(10,132,255,0.02)] to-transparent" />
      </div>

      {/* Professional Navigation Buttons (Apple Style) */}
      <div className="fixed top-6 right-6 z-50 flex gap-3">
        <motion.button
          onClick={() => {
            setShowCustomization(!showCustomization)
            setShowChat(false)
            setShowSmartHome(false)
            setShowHealthInsights(false)
            setShowBuildingAutomation(false)
          }}
          className={`glass-button p-3.5 transition-all duration-300 ${
            showCustomization 
              ? 'glass-button-accent shadow-apple-glow-blue' 
              : ''
          }`}
          title="Настройки"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.96 }}
        >
          <Settings size={20} strokeWidth={2} />
        </motion.button>
        
        <motion.button
          onClick={() => {
            setShowBuildingAutomation(!showBuildingAutomation)
            setShowChat(false)
            setShowSmartHome(false)
            setShowHealthInsights(false)
            setShowCustomization(false)
          }}
          className={`glass-button p-3.5 transition-all duration-300 ${
            showBuildingAutomation 
              ? 'glass-button-accent shadow-apple-glow-blue' 
              : ''
          }`}
          title="Автоматизация Здания"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.96 }}
        >
          <Layers size={20} strokeWidth={2} />
        </motion.button>
        
        <motion.button
          onClick={() => {
            setShowSmartHome(!showSmartHome)
            setShowChat(false)
            setShowHealthInsights(false)
            setShowCustomization(false)
            setShowBuildingAutomation(false)
          }}
          className={`glass-button p-3.5 transition-all duration-300 ${
            showSmartHome 
              ? 'glass-button-accent shadow-apple-glow-blue' 
              : ''
          }`}
          title="Умный Дом"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.96 }}
        >
          <Home size={20} strokeWidth={2} />
        </motion.button>
        
        <motion.button
          onClick={() => {
            setShowHealthInsights(!showHealthInsights)
            setShowChat(false)
            setShowSmartHome(false)
            setShowCustomization(false)
            setShowBuildingAutomation(false)
          }}
          className={`glass-button p-3.5 transition-all duration-300 ${
            showHealthInsights 
              ? 'glass-button-accent shadow-apple-glow-blue' 
              : ''
          }`}
          title="Продуктивность"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.96 }}
        >
          <Activity size={20} strokeWidth={2} />
        </motion.button>
        
        <motion.button
          onClick={() => {
            setShowChat(!showChat)
            setShowSmartHome(false)
            setShowHealthInsights(false)
            setShowCustomization(false)
            setShowBuildingAutomation(false)
          }}
          className={`glass-button p-3.5 transition-all duration-300 ${
            showChat 
              ? 'glass-button-accent shadow-apple-glow-blue' 
              : ''
          }`}
          title="Чат с ИИ"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.96 }}
        >
          <MessageSquare size={20} strokeWidth={2} />
        </motion.button>
      </div>

      {/* Chat container */}
      <ChatContainer messages={messages} isVisible={showChat} />

      {/* Building Automation */}
      <BuildingAutomation 
        isVisible={showBuildingAutomation} 
        onClose={() => setShowBuildingAutomation(false)} 
      />

      {/* Smart Home Control */}
      <SmartHomeControl 
        isVisible={showSmartHome} 
        onClose={() => setShowSmartHome(false)} 
      />

      {/* Productivity & Health */}
      <ProductivityHealth 
        isVisible={showHealthInsights} 
        onClose={() => setShowHealthInsights(false)} 
      />

      {/* Customization Panel */}
      <CustomizationPanel 
        isVisible={showCustomization} 
        onClose={() => setShowCustomization(false)} 
      />

      {/* Main voice interface */}
      {!showChat && !showSmartHome && !showHealthInsights && !showCustomization && !showBuildingAutomation && (
        <motion.div 
          className="flex items-center justify-center min-h-screen p-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
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
