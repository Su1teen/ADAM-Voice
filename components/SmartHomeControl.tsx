"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { 
  Home, 
  Sun, 
  Thermometer, 
  Camera, 
  Lock, 
  Music, 
  Tv, 
  Wifi,
  Power,
  Settings,
  X,
  ChevronRight
} from 'react-feather'

interface Device {
  id: string
  name: string
  type: 'light' | 'thermostat' | 'camera' | 'lock' | 'music' | 'tv' | 'wifi'
  isOn: boolean
  value?: number | string
  room: string
}

interface Room {
  id: string
  name: string
  devices: Device[]
  temperature?: number
  isActive?: boolean
}

interface SmartHomeControlProps {
  isVisible: boolean
  onClose: () => void
}

const mockRooms: Room[] = [
  {
    id: 'living-room',
    name: 'Гостиная',
    temperature: 22,
    isActive: true,
    devices: [
      { id: 'lr-main-light', name: 'Основное освещение', type: 'light', isOn: true, value: 85, room: 'living-room' },
      { id: 'lr-tv', name: 'Умный ТВ', type: 'tv', isOn: true, room: 'living-room' },
      { id: 'lr-thermostat', name: 'Термостат', type: 'thermostat', isOn: true, value: 22, room: 'living-room' },
      { id: 'lr-music', name: 'Колонки', type: 'music', isOn: false, room: 'living-room' },
    ]
  },
  {
    id: 'bedroom',
    name: 'Спальня',
    temperature: 20,
    isActive: false,
    devices: [
      { id: 'br-ceiling-light', name: 'Потолочный свет', type: 'light', isOn: false, value: 0, room: 'bedroom' },
      { id: 'br-bedside-light', name: 'Прикроватная лампа', type: 'light', isOn: true, value: 45, room: 'bedroom' },
      { id: 'br-tv', name: 'Телевизор', type: 'tv', isOn: false, room: 'bedroom' },
    ]
  },
  {
    id: 'kitchen',
    name: 'Кухня',
    temperature: 24,
    isActive: true,
    devices: [
      { id: 'k-main-light', name: 'Основное освещение', type: 'light', isOn: true, value: 90, room: 'kitchen' },
      { id: 'k-under-cabinet', name: 'Подсветка шкафов', type: 'light', isOn: true, value: 60, room: 'kitchen' },
      { id: 'k-music', name: 'Кухонная колонка', type: 'music', isOn: true, room: 'kitchen' },
    ]
  },
  {
    id: 'security',
    name: 'Безопасность',
    isActive: true,
    devices: [
      { id: 's-front-door', name: 'Парадная дверь', type: 'lock', isOn: true, room: 'security' },
      { id: 's-camera-1', name: 'Передняя камера', type: 'camera', isOn: true, room: 'security' },
      { id: 's-camera-2', name: 'Задняя камера', type: 'camera', isOn: true, room: 'security' },
      { id: 's-wifi', name: 'WiFi сеть', type: 'wifi', isOn: true, room: 'security' },
    ]
  }
]

const recentActions = [
  { action: 'Включили ТВ в гостиной', time: '2 минуты назад', room: 'Гостиная', type: 'device' },
  { action: 'Приглушили свет в спальне до 45%', time: '15 минут назад', room: 'Спальня', type: 'device' },
  { action: 'Запланировали колонку на кухне на 7:00', time: '1 час назад', room: 'Кухня', type: 'schedule' },
  { action: 'Система безопасности активирована', time: '2 часа назад', room: 'Безопасность', type: 'security' },
  { action: 'Термостат автоматически установлен на 22°C', time: '3 часа назад', room: 'Гостиная', type: 'automation' },
  { action: 'Обнаружено движение в прихожей', time: '4 часа назад', room: 'Безопасность', type: 'security' },
]

const energyStats = {
  today: { usage: 24.5, cost: 8.75, savings: 15 },
  week: { usage: 168.2, cost: 58.90, savings: 92 },
  month: { usage: 720.8, cost: 245.30, savings: 378 }
}

const scenarios = [
  { name: 'Доброе утро', devices: 4, active: true, icon: '🌅' },
  { name: 'Киновечер', devices: 6, active: false, icon: '🍿' },
  { name: 'Режим сна', devices: 8, active: false, icon: '🌙' },
  { name: 'Отсутствие', devices: 12, active: false, icon: '🚪' },
  { name: 'Парти', devices: 10, active: false, icon: '🎉' },
]

const getDeviceIcon = (type: Device['type'], size = 18) => {
  switch (type) {
    case 'light': return <Sun size={size} />
    case 'thermostat': return <Thermometer size={size} />
    case 'camera': return <Camera size={size} />
    case 'lock': return <Lock size={size} />
    case 'music': return <Music size={size} />
    case 'tv': return <Tv size={size} />
    case 'wifi': return <Wifi size={size} />
    default: return <Power size={size} />
  }
}

export default function SmartHomeControl({ isVisible, onClose }: SmartHomeControlProps) {
  const [rooms, setRooms] = useState<Room[]>(mockRooms)
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState<'devices' | 'energy' | 'scenarios'>('devices')
  const [activeScenarios, setActiveScenarios] = useState<string[]>(['Доброе утро'])

  const toggleScenario = (scenarioName: string) => {
    setActiveScenarios(prev => {
      if (prev.includes(scenarioName)) {
        return prev.filter(s => s !== scenarioName)
      } else {
        return [...prev, scenarioName]
      }
    })
    
    // Simulate device changes based on scenario
    setTimeout(() => {
      if (scenarioName === 'Режим сна') {
        setRooms(prev => prev.map(room => ({
          ...room,
          devices: room.devices.map(device => 
            device.type === 'light' 
              ? { ...device, isOn: false, value: 0 }
              : device
          )
        })))
      } else if (scenarioName === 'Доброе утро') {
        setRooms(prev => prev.map(room => ({
          ...room,
          devices: room.devices.map(device => 
            device.type === 'light' 
              ? { ...device, isOn: true, value: 80 }
              : device
          )
        })))
      }
    }, 500)
  }

  const toggleDevice = (deviceId: string) => {
    setRooms(prev => prev.map(room => ({
      ...room,
      devices: room.devices.map(device => 
        device.id === deviceId ? { ...device, isOn: !device.isOn } : device
      )
    })))
  }

  const updateDeviceValue = (deviceId: string, value: number) => {
    setRooms(prev => prev.map(room => ({
      ...room,
      devices: room.devices.map(device => 
        device.id === deviceId ? { ...device, value } : device
      )
    })))
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

          {/* Smart Home Panel */}
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
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-apple-green/20 to-apple-teal/20 flex items-center justify-center">
                  <Home size={20} className="text-apple-green" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">Умный Дом</h2>
                  <p className="text-xs text-[var(--text-tertiary)]">Управление устройствами и сценариями</p>
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
                { id: 'energy', label: 'Энергия', icon: <Thermometer size={16} /> },
                { id: 'scenarios', label: 'Сценарии', icon: <Settings size={16} /> }
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
              {/* Devices Tab */}
              {selectedTab === 'devices' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="glass-card p-3 text-center">
                      <div className="text-2xl font-bold text-apple-blue mb-1">{rooms.reduce((acc, room) => acc + room.devices.filter(d => d.isOn).length, 0)}</div>
                      <div className="text-xs text-[var(--text-tertiary)]">Активных</div>
                    </div>
                    <div className="glass-card p-3 text-center">
                      <div className="text-2xl font-bold text-apple-green mb-1">{rooms.filter(r => r.isActive).length}</div>
                      <div className="text-xs text-[var(--text-tertiary)]">Комнат</div>
                    </div>
                    <div className="glass-card p-3 text-center">
                      <div className="text-2xl font-bold text-apple-orange mb-1">
                        {Math.round(rooms.filter(r => r.temperature).reduce((acc, r) => acc + (r.temperature || 0), 0) / rooms.filter(r => r.temperature).length)}°C
                      </div>
                      <div className="text-xs text-[var(--text-tertiary)]">Средн.</div>
                    </div>
                  </div>

                  {/* Recent Actions */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">Последние Действия</h3>
                    {recentActions.slice(0, 3).map((action, index) => (
                      <div key={index} className="glass-card p-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            action.type === 'security' ? 'bg-apple-red' :
                            action.type === 'automation' ? 'bg-apple-green' :
                            action.type === 'schedule' ? 'bg-apple-orange' :
                            'bg-apple-blue'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-[var(--text-primary)] truncate">{action.action}</div>
                            <div className="text-xs text-[var(--text-tertiary)]">
                              {action.room} • {action.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Rooms */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">Комнаты</h3>
                    {rooms.map((room, idx) => (
                      <motion.div
                        key={room.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="glass-card overflow-hidden"
                      >
                        <button
                          onClick={() => setSelectedRoom(selectedRoom === room.id ? null : room.id)}
                          className="w-full p-4 flex items-center justify-between hover:bg-[var(--glass-light)] transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${room.isActive ? 'bg-apple-green' : 'bg-[var(--text-tertiary)]'}`} />
                            <div className="text-left">
                              <div className="font-medium text-[var(--text-primary)]">{room.name}</div>
                              <div className="text-xs text-[var(--text-secondary)]">
                                {room.devices.filter(d => d.isOn).length}/{room.devices.length} включено
                                {room.temperature && ` • ${room.temperature}°C`}
                              </div>
                            </div>
                          </div>
                          <ChevronRight 
                            size={16} 
                            className={`transform transition-transform text-[var(--text-tertiary)] ${selectedRoom === room.id ? 'rotate-90' : ''}`}
                          />
                        </button>

                        <AnimatePresence>
                          {selectedRoom === room.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="border-t border-[var(--border-thin)]"
                            >
                              <div className="p-4 space-y-3 bg-[var(--glass-surface)]">
                                {room.devices.map((device) => (
                                  <div key={device.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-[var(--glass-light)] transition-colors">
                                    <div className="flex items-center gap-3">
                                      <div className={`p-2 rounded-lg ${device.isOn ? 'bg-apple-blue/20' : 'bg-[var(--glass-light)]'}`}>
                                        {getDeviceIcon(device.type, 16)}
                                      </div>
                                      <div>
                                        <div className="text-sm font-medium text-[var(--text-primary)]">{device.name}</div>
                                        {device.value !== undefined && (
                                          <div className="text-xs text-[var(--text-secondary)]">
                                            {device.type === 'light' ? `${device.value}%` : 
                                             device.type === 'thermostat' ? `${device.value}°C` : 
                                             device.value}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {device.type === 'light' && device.isOn && (
                                        <input
                                          type="range"
                                          min="0"
                                          max="100"
                                          value={device.value as number || 0}
                                          onChange={(e) => updateDeviceValue(device.id, parseInt(e.target.value))}
                                          className="w-16 h-1 rounded-lg appearance-none cursor-pointer"
                                          style={{
                                            background: `linear-gradient(to right, var(--accent-blue) 0%, var(--accent-blue) ${device.value}%, var(--glass-light) ${device.value}%, var(--glass-light) 100%)`
                                          }}
                                        />
                                      )}
                                      <button
                                        onClick={() => toggleDevice(device.id)}
                                        className={`w-12 h-6 rounded-full transition-colors relative ${
                                          device.isOn ? 'bg-apple-blue' : 'bg-[var(--glass-light)]'
                                        }`}
                                      >
                                        <div className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                                          device.isOn ? 'translate-x-6' : 'translate-x-0.5'
                                        }`} />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Energy Tab */}
              {selectedTab === 'energy' && (
                <div className="p-4 space-y-6">
                  {/* Energy Overview */}
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--fg)] mb-3">Потребление энергии</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-[var(--bg-secondary)] rounded-xl p-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-[var(--fg)] font-medium">Сегодня</span>
                          <span className="text-sm text-[var(--success)]">-{energyStats.today.savings}% от вчера</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-[var(--fg-secondary)]">Потребление</span>
                            <span className="text-[var(--fg)]">{energyStats.today.usage} kWh</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[var(--fg-secondary)]">Стоимость</span>
                            <span className="text-[var(--fg)]">${energyStats.today.cost}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-[var(--bg-secondary)] rounded-xl p-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-[var(--fg)] font-medium">За неделю</span>
                          <span className="text-sm text-[var(--success)]">-{energyStats.week.savings}% от прошл. недели</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-[var(--fg-secondary)]">Потребление</span>
                            <span className="text-[var(--fg)]">{energyStats.week.usage} kWh</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[var(--fg-secondary)]">Стоимость</span>
                            <span className="text-[var(--fg)]">${energyStats.week.cost}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Top Energy Consumers */}
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--fg)] mb-3">Основные потребители</h3>
                    <div className="space-y-3">
                      <div className="bg-[var(--bg-secondary)] rounded-xl p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[var(--fg)]">Кондиционер</span>
                          <span className="text-sm text-[var(--fg-secondary)]">8.5 kWh</span>
                        </div>
                        <div className="w-full bg-[var(--bg-tertiary)] rounded-full h-2">
                          <div className="bg-[var(--error)] h-2 rounded-full" style={{ width: '85%' }} />
                        </div>
                      </div>
                      <div className="bg-[var(--bg-secondary)] rounded-xl p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[var(--fg)]">Освещение</span>
                          <span className="text-sm text-[var(--fg-secondary)]">4.2 kWh</span>
                        </div>
                        <div className="w-full bg-[var(--bg-tertiary)] rounded-full h-2">
                          <div className="bg-[var(--warning)] h-2 rounded-full" style={{ width: '42%' }} />
                        </div>
                      </div>
                      <div className="bg-[var(--bg-secondary)] rounded-xl p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[var(--fg)]">Развлечения</span>
                          <span className="text-sm text-[var(--fg-secondary)]">2.8 kWh</span>
                        </div>
                        <div className="w-full bg-[var(--bg-tertiary)] rounded-full h-2">
                          <div className="bg-[var(--accent)] h-2 rounded-full" style={{ width: '28%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Scenarios Tab */}
              {selectedTab === 'scenarios' && (
                <div className="p-4 space-y-6">
                  {/* Quick Scenarios */}
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--fg)] mb-3">Быстрые сценарии</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {scenarios.map((scenario, index) => (
                        <motion.button
                          key={scenario.name}
                          onClick={() => toggleScenario(scenario.name)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-4 rounded-xl text-left transition-all duration-200 ${
                            activeScenarios.includes(scenario.name)
                              ? 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-glow)]'
                              : 'bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[var(--fg)]'
                          }`}
                        >
                          <div className="text-2xl mb-2">{scenario.icon}</div>
                          <div className="font-medium">{scenario.name}</div>
                          <div className="text-xs opacity-70">{scenario.devices} устр.</div>
                          {activeScenarios.includes(scenario.name) && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full"
                            />
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Active Scenarios Status */}
                  {activeScenarios.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-[var(--success)]/10 rounded-xl p-4 border border-[var(--success)]/20"
                    >
                      <h4 className="text-sm font-medium text-[var(--success)] mb-2">Активные сценарии</h4>
                      <div className="space-y-1">
                        {activeScenarios.map((scenarioName) => (
                          <div key={scenarioName} className="text-xs text-[var(--fg-secondary)] flex items-center gap-2">
                            <div className="w-2 h-2 bg-[var(--success)] rounded-full animate-pulse" />
                            {scenarioName} - выполняется
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Automation Rules */}
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--fg)] mb-3">Правила автоматизации</h3>
                    <div className="space-y-3">
                      <div className="bg-[var(--bg-secondary)] rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-[var(--fg)] font-medium">Доброе утро</div>
                            <div className="text-xs text-[var(--fg-secondary)]">По будням в 7:00</div>
                          </div>
                          <div className="w-12 h-6 bg-[var(--accent)] rounded-full relative">
                            <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5" />
                          </div>
                        </div>
                      </div>
                      <div className="bg-[var(--bg-secondary)] rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-[var(--fg)] font-medium">Ночная безопасность</div>
                            <div className="text-xs text-[var(--fg-secondary)]">Ежедневно в 23:00</div>
                          </div>
                          <div className="w-12 h-6 bg-[var(--accent)] rounded-full relative">
                            <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5" />
                          </div>
                        </div>
                      </div>
                      <div className="bg-[var(--bg-secondary)] rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-[var(--fg)] font-medium">Энергосбережение</div>
                            <div className="text-xs text-[var(--fg-secondary)]">При отсутствии 2+ часа</div>
                          </div>
                          <div className="w-12 h-6 bg-[var(--bg-tertiary)] rounded-full relative">
                            <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}