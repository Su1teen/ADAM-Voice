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
import { useCallback, useEffect, useState } from 'react'
import { MessageSquare, X, Home, Activity, Settings, Layers } from 'react-feather'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface ConversationClientProps {
  conversationId: string
}

export default function ConversationClient({ conversationId }: ConversationClientProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [showChat, setShowChat] = useState(false)
  const [showSmartHome, setShowSmartHome] = useState(false)
  const [showHealthInsights, setShowHealthInsights] = useState(false)
  const [showCustomization, setShowCustomization] = useState(false)
  const [showBuildingAutomation, setShowBuildingAutomation] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  const loadConversation = () => {
    if (!conversationId) return
    fetch(`/api/c?id=${conversationId}`)
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
    if (!conversationId) return
    try {
      await fetch('/api/c', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: conversationId,
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
    const userMessage = addMessage('user', messageContent)
    await saveMessage(userMessage)

    try {
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
    if (conversationId) {
      loadConversation()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId])

  useEffect(() => {
    const connected = conversation.status === 'connected'
    if (connected !== isConnected) {
      setIsConnected(connected)
    }
  }, [conversation.status, isConnected])

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black pointer-events-none" />
      
      {/* Voice visualizer */}
      <motion.div
        className="fixed inset-0 flex items-center justify-center pointer-events-none z-10"
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

      {/* Chat overlay */}
      {showChat && (
        <motion.div
          className="fixed inset-0 z-30 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowChat(false)} />
          <motion.div
            className="relative w-full max-w-4xl h-[80vh]"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            <ChatContainer messages={messages} isVisible={showChat} />
          </motion.div>
        </motion.div>
      )}

      {/* Smart Home Panel */}
      {showSmartHome && (
        <motion.div
          className="fixed inset-0 z-30 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSmartHome(false)} />
          <motion.div
            className="relative w-full max-w-6xl h-[85vh]"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            <SmartHomeControl onClose={() => setShowSmartHome(false)} isVisible={showSmartHome} />
          </motion.div>
        </motion.div>
      )}

      {/* Productivity & Health Panel */}
      {showHealthInsights && (
        <motion.div
          className="fixed inset-0 z-30 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowHealthInsights(false)} />
          <motion.div
            className="relative w-full max-w-6xl h-[85vh]"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            <ProductivityHealth onClose={() => setShowHealthInsights(false)} isVisible={showHealthInsights} />
          </motion.div>
        </motion.div>
      )}

      {/* Building Automation Panel */}
      {showBuildingAutomation && (
        <motion.div
          className="fixed inset-0 z-30 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowBuildingAutomation(false)} />
          <motion.div
            className="relative w-full max-w-6xl h-[85vh]"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            <BuildingAutomation onClose={() => setShowBuildingAutomation(false)} isVisible={showBuildingAutomation} />
          </motion.div>
        </motion.div>
      )}

      {/* Customization Panel */}
      {showCustomization && (
        <motion.div
          className="fixed inset-0 z-30 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCustomization(false)} />
          <motion.div
            className="relative w-full max-w-6xl h-[85vh]"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            <CustomizationPanel onClose={() => setShowCustomization(false)} isVisible={showCustomization} />
          </motion.div>
        </motion.div>
      )}

      {/* Navigation buttons */}
      <motion.div
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-3"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', damping: 30, stiffness: 300 }}
      >
        <motion.button
          onClick={() => setShowChat(!showChat)}
          className="glass-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {showChat ? <X size={20} /> : <MessageSquare size={20} />}
          <span>Чат</span>
        </motion.button>

        <motion.button
          onClick={() => setShowSmartHome(!showSmartHome)}
          className="glass-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Home size={20} />
          <span>Умный дом</span>
        </motion.button>

        <motion.button
          onClick={() => setShowHealthInsights(!showHealthInsights)}
          className="glass-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Activity size={20} />
          <span>Продуктивность</span>
        </motion.button>

        <motion.button
          onClick={() => setShowBuildingAutomation(!showBuildingAutomation)}
          className="glass-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Layers size={20} />
          <span>Автоматизация</span>
        </motion.button>

        <motion.button
          onClick={() => setShowCustomization(!showCustomization)}
          className="glass-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Settings size={20} />
          <span>Настройки</span>
        </motion.button>
      </motion.div>

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
