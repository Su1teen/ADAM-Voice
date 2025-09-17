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
            className="absolute right-0 top-0 h-full w-full max-w-md bg-[var(--bg)] border-l border-[var(--border)] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
              <div className="flex items-center gap-3">
                <Home size={24} className="text-[var(--accent)]" />
                <h2 className="text-xl font-semibold text-[var(--fg)]">Умный дом</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[var(--border)] bg-[var(--bg-secondary)]">
              {[
                { id: 'devices', label: 'Устройства', icon: <Home size={16} /> },
                { id: 'energy', label: 'Энергия', icon: <Thermometer size={16} /> },
                { id: 'scenarios', label: 'Сценарии', icon: <Settings size={16} /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`flex-1 p-3 flex items-center justify-center gap-2 transition-colors ${
                    selectedTab === tab.id
                      ? 'text-[var(--accent)] border-b-2 border-[var(--accent)]'
                      : 'text-[var(--fg-secondary)] hover:text-[var(--fg)]'
                  }`}
                >
                  {tab.icon}
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="h-full overflow-y-auto pb-20">
              {/* Devices Tab */}
              {selectedTab === 'devices' && (
                <div>
                  {/* Quick Stats */}
                  <div className="p-4 border-b border-[var(--border)]">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-[var(--bg-secondary)] rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold text-[var(--accent)]">{rooms.reduce((acc, room) => acc + room.devices.filter(d => d.isOn).length, 0)}</div>
                        <div className="text-xs text-[var(--fg-secondary)]">Активных устройств</div>
                      </div>
                      <div className="bg-[var(--bg-secondary)] rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold text-[var(--success)]">{rooms.filter(r => r.isActive).length}</div>
                        <div className="text-xs text-[var(--fg-secondary)]">Активных комнат</div>
                      </div>
                      <div className="bg-[var(--bg-secondary)] rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold text-[var(--warning)]">
                          {Math.round(rooms.filter(r => r.temperature).reduce((acc, r) => acc + (r.temperature || 0), 0) / rooms.filter(r => r.temperature).length)}°C
                        </div>
                        <div className="text-xs text-[var(--fg-secondary)]">Средн. темп.</div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Actions */}
                  <div className="p-4 border-b border-[var(--border)]">
                    <h3 className="text-lg font-semibold text-[var(--fg)] mb-3">Последние действия</h3>
                    <div className="space-y-2">
                      {recentActions.slice(0, 3).map((action, index) => (
                        <div key={index} className="bg-[var(--bg-secondary)] rounded-xl p-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${
                              action.type === 'security' ? 'bg-[var(--error)]' :
                              action.type === 'automation' ? 'bg-[var(--success)]' :
                              action.type === 'schedule' ? 'bg-[var(--warning)]' :
                              'bg-[var(--accent)]'
                            }`} />
                            <div className="flex-1">
                              <div className="text-sm text-[var(--fg)]">{action.action}</div>
                              <div className="text-xs text-[var(--fg-muted)] mt-1">
                                {action.room} • {action.time}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rooms */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-[var(--fg)] mb-3">Комнаты</h3>
                    <div className="space-y-3">
                      {rooms.map((room) => (
                        <motion.div
                          key={room.id}
                          className="bg-[var(--bg-secondary)] rounded-xl overflow-hidden"
                          whileHover={{ scale: 1.02 }}
                        >
                          <button
                            onClick={() => setSelectedRoom(selectedRoom === room.id ? null : room.id)}
                            className="w-full p-4 flex items-center justify-between hover:bg-[var(--bg-tertiary)] transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${room.isActive ? 'bg-[var(--success)]' : 'bg-[var(--fg-muted)]'}`} />
                              <div>
                                <div className="text-left font-medium text-[var(--fg)]">{room.name}</div>
                                <div className="text-sm text-[var(--fg-secondary)]">
                                  {room.devices.filter(d => d.isOn).length}/{room.devices.length} включено
                                  {room.temperature && ` • ${room.temperature}°C`}
                                </div>
                              </div>
                            </div>
                            <ChevronRight 
                              size={16} 
                              className={`transform transition-transform ${selectedRoom === room.id ? 'rotate-90' : ''}`}
                            />
                          </button>

                          <AnimatePresence>
                            {selectedRoom === room.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="border-t border-[var(--border)]"
                              >
                                <div className="p-4 space-y-3">
                                  {room.devices.map((device) => (
                                    <div key={device.id} className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${device.isOn ? 'bg-[var(--accent)]' : 'bg-[var(--bg-tertiary)]'}`}>
                                          {getDeviceIcon(device.type, 16)}
                                        </div>
                                        <div>
                                          <div className="text-sm font-medium text-[var(--fg)]">{device.name}</div>
                                          {device.value !== undefined && (
                                            <div className="text-xs text-[var(--fg-secondary)]">
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
                                            className="w-16 h-1 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer slider"
                                          />
                                        )}
                                        <button
                                          onClick={() => toggleDevice(device.id)}
                                          className={`w-12 h-6 rounded-full transition-colors relative ${
                                            device.isOn ? 'bg-[var(--accent)]' : 'bg-[var(--bg-tertiary)]'
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
                  </div>
                </div>
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
        </motion.div>
      )}
    </AnimatePresence>
  )
}