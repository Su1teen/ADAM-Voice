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
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg)] via-[var(--bg-secondary)] to-[var(--bg)]">
      {/* Background effects */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--accent)] rounded-full filter blur-3xl opacity-20" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-20" />
      </div>

      {/* Navigation buttons */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => {
            setShowCustomization(!showCustomization)
            setShowChat(false)
            setShowSmartHome(false)
            setShowHealthInsights(false)
          }}
          className={`p-3 rounded-xl border border-[var(--border)] transition-all duration-200 ${
            showCustomization 
              ? 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-glow)]' 
              : 'bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[var(--fg)]'
          }`}
          title="Настройки"
        >
          <Settings size={20} />
        </button>
        
        <button
          onClick={() => {
            setShowSmartHome(!showSmartHome)
            setShowChat(false)
            setShowHealthInsights(false)
            setShowCustomization(false)
          }}
          className={`p-3 rounded-xl border border-[var(--border)] transition-all duration-200 ${
            showSmartHome 
              ? 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-glow)]' 
              : 'bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[var(--fg)]'
          }`}
          title="Умный дом"
        >
          <Home size={20} />
        </button>
        
        <button
          onClick={() => {
            setShowHealthInsights(!showHealthInsights)
            setShowChat(false)
            setShowSmartHome(false)
            setShowCustomization(false)
          }}
          className={`p-3 rounded-xl border border-[var(--border)] transition-all duration-200 ${
            showHealthInsights 
              ? 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-glow)]' 
              : 'bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[var(--fg)]'
          }`}
          title="Здоровье и аналитика"
        >
          <Activity size={20} />
        </button>
        
        <button
          onClick={() => {
            setShowChat(!showChat)
            setShowSmartHome(false)
            setShowHealthInsights(false)
            setShowCustomization(false)
          }}
          className={`p-3 rounded-xl border border-[var(--border)] transition-all duration-200 ${
            showChat 
              ? 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-glow)]' 
              : 'bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[var(--fg)]'
          }`}
          title="Голосовой чат"
        >
          <MessageSquare size={20} />
        </button>
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
