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
  Zap
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
    case 'connected': return 'text-[var(--success)]'
    case 'connecting': return 'text-[var(--warning)]'
    case 'failed': return 'text-[var(--error)]'
    default: return 'text-[var(--fg-secondary)]'
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="mobile-scroll-container absolute right-0 top-0 h-full w-full max-w-md glass-panel border-l shadow-2xl overflow-hidden"
          >
            {/* Advanced Liquid Glass Header */}
            <div className="glass-surface flex items-center justify-between p-4 border-b border-[var(--border-glass)]">
              <div className="flex items-center gap-3">
                <div className="glass-circle p-2 w-10 h-10 flex items-center justify-center">
                  <Settings size={20} className="text-[var(--accent)]" />
                </div>
                <h2 className="text-xl font-semibold text-[var(--fg)]">Настройки</h2>
              </div>
              <motion.button
                onClick={onClose}
                className="glass-button p-2 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Advanced Glass Tabs */}
            <div className="glass-frosted flex border-b border-[var(--border-glass)] overflow-x-auto">
              {[
                { id: 'devices', label: 'Устройства', icon: <Home size={14} /> },
                { id: 'voice', label: 'Голос', icon: <Mic size={14} /> },
                { id: 'automation', label: 'Правила', icon: <Clock size={14} /> },
                { id: 'general', label: 'Общие', icon: <Settings size={14} /> }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`flex-1 p-3 flex items-center justify-center gap-1 transition-all duration-300 min-w-0 relative ${
                    selectedTab === tab.id
                      ? 'text-[var(--accent)]'
                      : 'text-[var(--fg-secondary)] hover:text-[var(--fg)]'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {selectedTab === tab.id && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-light)]"
                      layoutId="activeSettingsTab"
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                  {tab.icon}
                  <span className="text-xs font-medium truncate">{tab.label}</span>
                </motion.button>
              ))}
            </div>

            <div className="h-full overflow-y-auto pb-20">
              {/* Device Discovery Tab */}
              {selectedTab === 'devices' && (
                <div className="p-4 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-[var(--fg)]">Поиск устройств</h3>
                    <motion.button 
                      onClick={startScan}
                      disabled={isScanning}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                        isScanning 
                          ? 'bg-[var(--warning)] text-white' 
                          : 'bg-[var(--accent)] hover:bg-[var(--accent-light)] text-white'
                      }`}
                    >
                      <motion.div
                        animate={isScanning ? { rotate: 360 } : { rotate: 0 }}
                        transition={{ duration: 1, repeat: isScanning ? Infinity : 0 }}
                      >
                        <Search size={16} />
                      </motion.div>
                      {isScanning ? 'Сканируем...' : 'Сканировать'}
                    </motion.button>
                  </div>

                  {/* Connection Status */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[var(--bg-secondary)] rounded-xl p-3 text-center">
                      <Wifi size={20} className="mx-auto mb-2 text-[var(--success)]" />
                      <div className="text-sm font-medium text-[var(--fg)]">Подключен к WiFi</div>
                      <div className="text-xs text-[var(--fg-secondary)]">Домашняя сеть</div>
                    </div>
                    <div className="bg-[var(--bg-secondary)] rounded-xl p-3 text-center">
                      <Bluetooth size={20} className="mx-auto mb-2 text-[var(--accent)]" />
                      <div className="text-sm font-medium text-[var(--fg)]">Bluetooth активен</div>
                      <div className="text-xs text-[var(--fg-secondary)]">6 устройств поблизости</div>
                    </div>
                  </div>

                  {/* Discovered Devices */}
                  <div>
                    <h4 className="text-md font-semibold text-[var(--fg)] mb-3">Найденные устройства</h4>
                    <div className="space-y-3">
                      {devices.map((device) => (
                        <motion.div
                          key={device.id}
                          whileHover={{ scale: 1.02 }}
                          className="bg-[var(--bg-secondary)] rounded-xl p-4"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${
                                device.status === 'connected' ? 'bg-[var(--success)]/20' : 'bg-[var(--bg-tertiary)]'
                              }`}>
                                {getDeviceIcon(device.type, 16)}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-[var(--fg)]">{device.name}</div>
                                <div className="text-xs text-[var(--fg-secondary)] flex items-center gap-2">
                                  <span className={getStatusColor(device.status)}>
                                    {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                                  </span>
                                  {device.room && <span>• {device.room}</span>}
                                  <span>• Сигнал: {device.signal}%</span>
                                </div>
                              </div>
                            </div>
                            {device.status === 'discovered' && (
                              <button
                                onClick={() => connectDevice(device.id)}
                                className="px-3 py-1 bg-[var(--accent)] text-white rounded-lg text-sm"
                              >
                                Подключить
                              </button>
                            )}
                            {device.status === 'connecting' && (
                              <div className="px-3 py-1 bg-[var(--warning)] text-white rounded-lg text-sm">
                                Подключаем...
                              </div>
                            )}
                            {device.status === 'connected' && (
                              <div className="px-3 py-1 bg-[var(--success)] text-white rounded-lg text-sm">
                                Подключено
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Voice Customization Tab */}
              {selectedTab === 'voice' && (
                <div className="p-4 space-y-6">
                  <h3 className="text-lg font-semibold text-[var(--fg)]">Голосовой помощник</h3>
                  
                  {/* Voice Profiles */}
                  <div>
                    <h4 className="text-md font-semibold text-[var(--fg)] mb-3">Голосовые профили</h4>
                    <div className="space-y-3">
                      {voiceProfiles.map((voice) => (
                        <motion.button
                          key={voice.id}
                          onClick={() => selectVoice(voice.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full bg-[var(--bg-secondary)] rounded-xl p-4 text-left transition-all ${
                            selectedVoice === voice.id ? 'ring-2 ring-[var(--accent)]' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm font-medium text-[var(--fg)]">{voice.name}</div>
                              <div className="text-xs text-[var(--fg-secondary)]">
                                {voice.gender === 'male' ? 'Мужской' : 'Женский'} • {voice.accent} • Скорость: {voice.speed}x
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button className="p-2 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--border)] transition-colors">
                                <Volume2 size={16} />
                              </button>
                              {selectedVoice === voice.id && (
                                <div className="w-3 h-3 bg-[var(--accent)] rounded-full" />
                              )}
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Voice Settings */}
                  <div>
                    <h4 className="text-md font-semibold text-[var(--fg)] mb-3">Настройки голоса</h4>
                    <div className="space-y-4">
                      <div className="bg-[var(--bg-secondary)] rounded-xl p-4">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm text-[var(--fg)]">Скорость речи</span>
                          <span className="text-sm text-[var(--fg-secondary)]">{voiceSpeed.toFixed(1)}x</span>
                        </div>
                        <input
                          type="range"
                          min="0.5"
                          max="2.0"
                          step="0.1"
                          value={voiceSpeed}
                          onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                          className="w-full h-2 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>
                      
                      <div className="bg-[var(--bg-secondary)] rounded-xl p-4">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm text-[var(--fg)]">Громкость голоса</span>
                          <span className="text-sm text-[var(--fg-secondary)]">{voiceVolume}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={voiceVolume}
                          onChange={(e) => setVoiceVolume(parseInt(e.target.value))}
                          className="w-full h-2 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>

                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className="bg-[var(--bg-secondary)] rounded-xl p-4"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-sm text-[var(--fg)]">Обнаружение ключевого слова</span>
                            <div className="text-xs text-[var(--fg-secondary)]">Слушать "Привет, Помощник"</div>
                          </div>
                          <div className="w-12 h-6 bg-[var(--accent)] rounded-full relative">
                            <motion.div 
                              className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"
                              layout
                            />
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              )}

              {/* Automation Rules Tab */}
              {selectedTab === 'automation' && (
                <div className="p-4 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-[var(--fg)]">Правила автоматизации</h3>
                    <button className="flex items-center gap-2 px-3 py-2 bg-[var(--accent)] text-white rounded-lg text-sm">
                      <Plus size={16} />
                      Добавить правило
                    </button>
                  </div>

                  <div className="space-y-3">
                    {rules.map((rule) => (
                      <motion.div
                        key={rule.id}
                        whileHover={{ scale: 1.02 }}
                        className="bg-[var(--bg-secondary)] rounded-xl p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-[var(--fg)]">{rule.name}</div>
                            <div className="text-xs text-[var(--fg-secondary)] mt-1">
                              <strong>Условие:</strong> {rule.trigger}
                            </div>
                            <div className="text-xs text-[var(--fg-secondary)] mt-1">
                              <strong>Действие:</strong> {rule.action}
                            </div>
                            {rule.schedule && (
                              <div className="text-xs text-[var(--accent)] mt-1">
                                📅 {rule.schedule}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => toggleRule(rule.id)}
                            className={`w-12 h-6 rounded-full transition-colors relative ${
                              rule.enabled ? 'bg-[var(--accent)]' : 'bg-[var(--bg-tertiary)]'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                              rule.enabled ? 'translate-x-6' : 'translate-x-0.5'
                            }`} />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className={`text-xs ${rule.enabled ? 'text-[var(--success)]' : 'text-[var(--fg-muted)]'}`}>
                            {rule.enabled ? '✓ Активно' : '○ Неактивно'}
                          </div>
                          <button className="text-xs text-[var(--accent)] hover:underline">
                            Редактировать
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* General Settings Tab */}
              {selectedTab === 'general' && (
                <div className="p-4 space-y-6">
                  <h3 className="text-lg font-semibold text-[var(--fg)]">Общие настройки</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-[var(--bg-secondary)] rounded-xl p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-sm text-[var(--fg)]">Тёмная тема</span>
                          <div className="text-xs text-[var(--fg-secondary)]">Использовать тёмную тему</div>
                        </div>
                        <div className="w-12 h-6 bg-[var(--accent)] rounded-full relative">
                          <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-[var(--bg-secondary)] rounded-xl p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-sm text-[var(--fg)]">Уведомления</span>
                          <div className="text-xs text-[var(--fg-secondary)]">Пуш-уведомления для оповещений</div>
                        </div>
                        <div className="w-12 h-6 bg-[var(--accent)] rounded-full relative">
                          <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-[var(--bg-secondary)] rounded-xl p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-sm text-[var(--fg)]">Режим конфиденциальности</span>
                          <div className="text-xs text-[var(--fg-secondary)]">Ограничить сбор данных</div>
                        </div>
                        <div className="w-12 h-6 bg-[var(--bg-tertiary)] rounded-full relative">
                          <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-[var(--bg-secondary)] rounded-xl p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-sm text-[var(--fg)]">Автообновления</span>
                          <div className="text-xs text-[var(--fg-secondary)]">Автоматически устанавливать обновления</div>
                        </div>
                        <div className="w-12 h-6 bg-[var(--accent)] rounded-full relative">
                          <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* System Info */}
                  <div>
                    <h4 className="text-md font-semibold text-[var(--fg)] mb-3">Системная информация</h4>
                    <div className="bg-[var(--bg-secondary)] rounded-xl p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-[var(--fg-secondary)]">Версия</span>
                        <span className="text-xs text-[var(--fg)]">2.1.0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-[var(--fg-secondary)]">Последнее обновление</span>
                        <span className="text-xs text-[var(--fg)]">2 дня назад</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-[var(--fg-secondary)]">Подключённые устройства</span>
                        <span className="text-xs text-[var(--fg)]">{devices.filter(d => d.status === 'connected').length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-[var(--fg-secondary)]">Активные правила</span>
                        <span className="text-xs text-[var(--fg)]">{rules.filter(r => r.enabled).length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}