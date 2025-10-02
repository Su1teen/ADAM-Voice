"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { 
  Settings,
  Plus,
  Search,
  Wifi,
  Bluetooth,
  Mic,
  Volume2,
  Clock,
  X,
  ChevronRight,
  Sun,
  Moon,
  Home,
  Shield,
  Zap,
  Check,
  AlertCircle
} from 'react-feather'

interface CustomizationProps {
  isVisible: boolean
  onClose: () => void
}

interface DiscoveredDevice {
  id: string
  name: string
  type: 'light' | 'thermostat' | 'camera' | 'lock' | 'speaker' | 'sensor'
  room?: string
  status: 'discovered' | 'connecting' | 'connected' | 'failed'
  signal: number
}

interface VoiceProfile {
  id: string
  name: string
  gender: 'male' | 'female'
  accent: string
  speed: number
  active: boolean
}

interface AutomationRule {
  id: string
  name: string
  trigger: string
  action: string
  enabled: boolean
  schedule?: string
}

const discoveredDevices: DiscoveredDevice[] = [
  { id: 'philips-hue-1', name: 'Philips Hue Мост', type: 'light', status: 'discovered', signal: 95 },
  { id: 'nest-thermostat', name: 'Nest Термостат', type: 'thermostat', status: 'connected', signal: 88, room: 'Гостиная' },
  { id: 'ring-doorbell', name: 'Ring Домофон', type: 'camera', status: 'discovered', signal: 72 },
  { id: 'august-lock', name: 'August Умный замок', type: 'lock', status: 'connecting', signal: 85 },
  { id: 'sonos-speaker', name: 'Sonos One', type: 'speaker', status: 'connected', signal: 90, room: 'Кухня' },
  { id: 'motion-sensor', name: 'Датчик движения', type: 'sensor', status: 'discovered', signal: 78 }
]

const voiceProfiles: VoiceProfile[] = [
  { id: 'alice', name: 'Алиса', gender: 'female', accent: 'Американский', speed: 1.0, active: true },
  { id: 'david', name: 'Дэвид', gender: 'male', accent: 'Британский', speed: 0.9, active: false },
  { id: 'emma', name: 'Эмма', gender: 'female', accent: 'Австралийский', speed: 1.1, active: false },
  { id: 'james', name: 'Джеймс', gender: 'male', accent: 'Канадский', speed: 1.0, active: false }
]

const automationRules: AutomationRule[] = [
  { 
    id: 'good-morning', 
    name: 'Доброе утро', 
    trigger: 'Время: 7:00 (будни)', 
    action: 'Включить свет, запустить кофеварку, включить новости',
    enabled: true,
    schedule: 'Пн-Пт 07:00'
  },
  { 
    id: 'bedtime', 
    name: 'Отбой ко сну', 
    trigger: 'Время: 23:00', 
    action: 'Приглушить свет, закрыть двери, установить температуру 20°C',
    enabled: true,
    schedule: 'Ежедневно 23:00'
  },
  { 
    id: 'away-mode', 
    name: 'Режим отсутствия', 
    trigger: 'Местоположение: Покинул дом', 
    action: 'Выключить все огни, включить охрану, настроить термостат',
    enabled: false
  },
  { 
    id: 'movie-night', 
    name: 'Киновечер', 
    trigger: 'Голос: "Время кино"', 
    action: 'Приглушить свет до 10%, включить ТВ, закрыть жалюзи',
    enabled: true
  }
]

const getDeviceIcon = (type: DiscoveredDevice['type'], size = 18) => {
  switch (type) {
    case 'light': return <Sun size={size} />
    case 'thermostat': return <Settings size={size} />
    case 'camera': return <Shield size={size} />
    case 'lock': return <Home size={size} />
    case 'speaker': return <Volume2 size={size} />
    case 'sensor': return <Zap size={size} />
    default: return <Settings size={size} />
  }
}

const getStatusColor = (status: DiscoveredDevice['status']) => {
  switch (status) {
    case 'connected': return 'text-apple-green'
    case 'connecting': return 'text-apple-orange'
    case 'failed': return 'text-apple-red'
    default: return 'text-[var(--text-secondary)]'
  }
}

const getStatusText = (status: DiscoveredDevice['status']) => {
  switch (status) {
    case 'connected': return 'Подключено'
    case 'connecting': return 'Подключение...'
    case 'failed': return 'Ошибка'
    default: return 'Обнаружено'
  }
}

export default function CustomizationPanel({ isVisible, onClose }: CustomizationProps) {
  const [selectedTab, setSelectedTab] = useState<'devices' | 'voice' | 'automation' | 'general'>('devices')
  const [selectedVoice, setSelectedVoice] = useState('alice')
  const [devices, setDevices] = useState<DiscoveredDevice[]>(discoveredDevices)
  const [rules, setRules] = useState<AutomationRule[]>(automationRules)
  const [isScanning, setIsScanning] = useState(false)
  const [voiceSpeed, setVoiceSpeed] = useState(1.0)
  const [voiceVolume, setVoiceVolume] = useState(75)

  const startScan = () => {
    setIsScanning(true)
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false)
      // Simulate finding new devices
      const newDevice = {
        id: 'new-device-' + Date.now(),
        name: 'Новое устройство',
        type: 'light' as const,
        status: 'discovered' as const,
        signal: Math.floor(Math.random() * 30) + 70
      }
      setDevices(prev => [...prev, newDevice])
    }, 3000)
  }

  const connectDevice = (deviceId: string) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, status: 'connecting' }
        : device
    ))

    // Simulate connection process
    setTimeout(() => {
      setDevices(prev => prev.map(device => 
        device.id === deviceId 
          ? { ...device, status: 'connected', room: 'Гостиная' }
          : device
      ))
    }, 2000)
  }

  const toggleRule = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { ...rule, enabled: !rule.enabled }
        : rule
    ))
  }

  const selectVoice = (voiceId: string) => {
    setSelectedVoice(voiceId)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Settings Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[480px] lg:w-[560px] glass-panel rounded-l-3xl shadow-apple-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--border-base)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-apple-blue/20 to-apple-purple/20 flex items-center justify-center">
                  <Settings size={20} className="text-apple-blue" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">Настройки</h2>
                  <p className="text-xs text-[var(--text-tertiary)]">Управление системой и устройствами</p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="glass-button p-2 rounded-full"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-4 border-b border-[var(--border-base)] overflow-x-auto">
              {[
                { id: 'devices', label: 'Устройства', icon: <Home size={16} /> },
                { id: 'voice', label: 'Голос', icon: <Mic size={16} /> },
                { id: 'automation', label: 'Автоматизация', icon: <Clock size={16} /> },
                { id: 'general', label: 'Общие', icon: <Settings size={16} /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                    selectedTab === tab.id
                      ? 'glass-button-accent'
                      : 'glass-button'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Device Discovery Tab */}
              {selectedTab === 'devices' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Scan Button */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">Поиск Устройств</h3>
                    <motion.button 
                      onClick={startScan}
                      disabled={isScanning}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        isScanning 
                          ? 'glass-button cursor-not-allowed' 
                          : 'glass-button-accent'
                      }`}
                    >
                      <motion.div
                        animate={isScanning ? { rotate: 360 } : { rotate: 0 }}
                        transition={{ duration: 1, repeat: isScanning ? Infinity : 0, ease: 'linear' }}
                      >
                        <Search size={16} />
                      </motion.div>
                      {isScanning ? 'Сканирование...' : 'Сканировать'}
                    </motion.button>
                  </div>

                  {/* Connection Status */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="glass-card p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-apple-green/20 flex items-center justify-center">
                          <Wifi size={18} className="text-apple-green" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-[var(--text-tertiary)]">WiFi</div>
                          <div className="text-sm font-semibold text-[var(--text-primary)] truncate">Подключено</div>
                        </div>
                      </div>
                      <div className="text-xs text-[var(--text-secondary)]">Домашняя сеть</div>
                    </div>
                    
                    <div className="glass-card p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-apple-blue/20 flex items-center justify-center">
                          <Bluetooth size={18} className="text-apple-blue" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-[var(--text-tertiary)]">Bluetooth</div>
                          <div className="text-sm font-semibold text-[var(--text-primary)]">Активен</div>
                        </div>
                      </div>
                      <div className="text-xs text-[var(--text-secondary)]">6 устройств</div>
                    </div>
                  </div>

                  {/* Discovered Devices */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-[var(--text-primary)]">Найденные Устройства</h4>
                    {devices.map((device, idx) => (
                      <motion.div
                        key={device.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="glass-card p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            device.status === 'connected' ? 'bg-apple-green/20' :
                            device.status === 'connecting' ? 'bg-apple-orange/20' :
                            'bg-[var(--glass-light)]'
                          }`}>
                            {getDeviceIcon(device.type, 18)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="text-sm font-medium text-[var(--text-primary)] truncate">{device.name}</h5>
                              {device.status === 'connected' && (
                                <Check size={14} className="text-apple-green flex-shrink-0" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <span className={getStatusColor(device.status)}>
                                {getStatusText(device.status)}
                              </span>
                              {device.room && (
                                <>
                                  <span className="text-[var(--text-tertiary)]">•</span>
                                  <span className="text-[var(--text-tertiary)]">{device.room}</span>
                                </>
                              )}
                              <span className="text-[var(--text-tertiary)]">•</span>
                              <span className="text-[var(--text-tertiary)]">{device.signal}%</span>
                            </div>
                          </div>

                          {device.status === 'discovered' && (
                            <button
                              onClick={() => connectDevice(device.id)}
                              className="px-3 py-1.5 rounded-lg text-xs font-medium glass-button-accent"
                            >
                              Подключить
                            </button>
                          )}

                          {device.status === 'connecting' && (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="text-apple-orange"
                            >
                              <Settings size={16} />
                            </motion.div>
                          )}

                          {device.status === 'connected' && (
                            <button className="p-1.5 rounded-lg glass-button">
                              <ChevronRight size={16} />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Voice Customization Tab */}
              {selectedTab === 'voice' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Voice Profiles */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">Голосовые Профили</h3>
                    {voiceProfiles.map((voice) => (
                      <motion.div
                        key={voice.id}
                        onClick={() => selectVoice(voice.id)}
                        className={`glass-card p-4 cursor-pointer transition-all ${
                          selectedVoice === voice.id ? 'border-apple-blue/50' : ''
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            selectedVoice === voice.id 
                              ? 'bg-gradient-to-br from-apple-blue/30 to-apple-purple/30' 
                              : 'bg-[var(--glass-light)]'
                          }`}>
                            <Mic size={20} className={selectedVoice === voice.id ? 'text-apple-blue' : 'text-[var(--text-tertiary)]'} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-semibold text-[var(--text-primary)]">{voice.name}</h4>
                              {selectedVoice === voice.id && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-apple-blue/20 text-apple-blue">
                                  Активен
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-[var(--text-secondary)]">
                              {voice.gender === 'male' ? 'Мужской' : 'Женский'} • {voice.accent}
                            </div>
                          </div>

                          {selectedVoice === voice.id && (
                            <Check size={20} className="text-apple-blue" />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Voice Settings */}
                  <div className="glass-card p-5 space-y-4">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">Настройки Голоса</h3>
                    
                    {/* Speed Control */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-[var(--text-secondary)]">Скорость речи</span>
                        <span className="text-sm font-semibold text-[var(--text-primary)]">{voiceSpeed.toFixed(1)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="2.0"
                        step="0.1"
                        value={voiceSpeed}
                        onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                        className="w-full h-2 rounded-full bg-[var(--glass-light)] appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, var(--accent-blue) 0%, var(--accent-blue) ${(voiceSpeed - 0.5) / 1.5 * 100}%, var(--glass-light) ${(voiceSpeed - 0.5) / 1.5 * 100}%, var(--glass-light) 100%)`
                        }}
                      />
                      <div className="flex justify-between text-xs text-[var(--text-tertiary)] mt-1">
                        <span>Медленнее</span>
                        <span>Быстрее</span>
                      </div>
                    </div>

                    {/* Volume Control */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-[var(--text-secondary)]">Громкость</span>
                        <span className="text-sm font-semibold text-[var(--text-primary)]">{voiceVolume}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={voiceVolume}
                        onChange={(e) => setVoiceVolume(parseInt(e.target.value))}
                        className="w-full h-2 rounded-full bg-[var(--glass-light)] appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, var(--accent-blue) 0%, var(--accent-blue) ${voiceVolume}%, var(--glass-light) ${voiceVolume}%, var(--glass-light) 100%)`
                        }}
                      />
                      <div className="flex justify-between text-xs text-[var(--text-tertiary)] mt-1">
                        <span>Тихо</span>
                        <span>Громко</span>
                      </div>
                    </div>
                  </div>

                  {/* Test Button */}
                  <button className="w-full glass-button-accent py-3 text-sm font-medium">
                    Проверить Голос
                  </button>
                </motion.div>
              )}

              {/* Automation Rules Tab */}
              {selectedTab === 'automation' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">Правила Автоматизации</h3>
                    <button className="glass-button p-2 rounded-lg">
                      <Plus size={18} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {rules.map((rule, idx) => (
                      <motion.div
                        key={rule.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`glass-card p-4 ${rule.enabled ? 'border-apple-blue/30' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            rule.enabled ? 'bg-apple-blue/20' : 'bg-[var(--glass-light)]'
                          }`}>
                            <Clock size={18} className={rule.enabled ? 'text-apple-blue' : 'text-[var(--text-tertiary)]'} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-sm font-semibold text-[var(--text-primary)]">{rule.name}</h4>
                              {rule.enabled && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-apple-green/20 text-apple-green">
                                  Активно
                                </span>
                              )}
                            </div>
                            
                            <div className="space-y-2 text-xs">
                              <div>
                                <span className="text-[var(--text-tertiary)]">Триггер:</span>
                                <span className="text-[var(--text-secondary)] ml-2">{rule.trigger}</span>
                              </div>
                              <div>
                                <span className="text-[var(--text-tertiary)]">Действие:</span>
                                <span className="text-[var(--text-secondary)] ml-2">{rule.action}</span>
                              </div>
                              {rule.schedule && (
                                <div className="flex items-center gap-2 mt-2">
                                  <Clock size={12} className="text-[var(--text-tertiary)]" />
                                  <span className="text-[var(--text-tertiary)]">{rule.schedule}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => toggleRule(rule.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              rule.enabled 
                                ? 'glass-button-accent' 
                                : 'glass-button'
                            }`}
                          >
                            {rule.enabled ? 'Выкл' : 'Вкл'}
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* General Settings Tab */}
              {selectedTab === 'general' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">Общие Настройки</h3>

                  {/* Theme */}
                  <div className="glass-card p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-apple-purple/20 to-apple-pink/20 flex items-center justify-center">
                          <Moon size={18} className="text-apple-purple" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[var(--text-primary)]">Темная тема</div>
                          <div className="text-xs text-[var(--text-tertiary)]">Apple Liquid Glass</div>
                        </div>
                      </div>
                      <div className="w-12 h-6 bg-apple-blue rounded-full flex items-center px-1">
                        <motion.div 
                          className="w-4 h-4 bg-white rounded-full"
                          animate={{ x: 20 }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Notifications */}
                  <div className="glass-card p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-apple-red/20 flex items-center justify-center">
                          <AlertCircle size={18} className="text-apple-red" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[var(--text-primary)]">Уведомления</div>
                          <div className="text-xs text-[var(--text-tertiary)]">Системные оповещения</div>
                        </div>
                      </div>
                      <div className="w-12 h-6 bg-apple-blue rounded-full flex items-center px-1">
                        <motion.div 
                          className="w-4 h-4 bg-white rounded-full"
                          animate={{ x: 20 }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Language */}
                  <div className="glass-card p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-apple-blue/20 flex items-center justify-center">
                          <span className="text-lg">🌐</span>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[var(--text-primary)]">Язык</div>
                          <div className="text-xs text-[var(--text-tertiary)]">Русский</div>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-[var(--text-tertiary)]" />
                    </div>
                  </div>

                  {/* About */}
                  <div className="glass-card p-5 bg-gradient-to-br from-apple-blue/10 to-transparent border-apple-blue/20">
                    <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">О Системе</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-[var(--text-tertiary)]">Версия:</span>
                        <span className="text-[var(--text-secondary)] font-medium">2.5.0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-tertiary)]">Устройств:</span>
                        <span className="text-[var(--text-secondary)] font-medium">{devices.filter(d => d.status === 'connected').length} подключено</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-tertiary)]">Правил:</span>
                        <span className="text-[var(--text-secondary)] font-medium">{rules.filter(r => r.enabled).length} активно</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}