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
    name: 'Living Room',
    temperature: 22,
    isActive: true,
    devices: [
      { id: 'lr-main-light', name: 'Main Light', type: 'light', isOn: true, value: 85, room: 'living-room' },
      { id: 'lr-tv', name: 'Smart TV', type: 'tv', isOn: true, room: 'living-room' },
      { id: 'lr-thermostat', name: 'Thermostat', type: 'thermostat', isOn: true, value: 22, room: 'living-room' },
      { id: 'lr-music', name: 'Speakers', type: 'music', isOn: false, room: 'living-room' },
    ]
  },
  {
    id: 'bedroom',
    name: 'Bedroom',
    temperature: 20,
    isActive: false,
    devices: [
      { id: 'br-ceiling-light', name: 'Ceiling Light', type: 'light', isOn: false, value: 0, room: 'bedroom' },
      { id: 'br-bedside-light', name: 'Bedside Lamp', type: 'light', isOn: true, value: 45, room: 'bedroom' },
      { id: 'br-tv', name: 'TV', type: 'tv', isOn: false, room: 'bedroom' },
    ]
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    temperature: 24,
    isActive: true,
    devices: [
      { id: 'k-main-light', name: 'Main Light', type: 'light', isOn: true, value: 90, room: 'kitchen' },
      { id: 'k-under-cabinet', name: 'Under Cabinet', type: 'light', isOn: true, value: 60, room: 'kitchen' },
      { id: 'k-music', name: 'Kitchen Speaker', type: 'music', isOn: true, room: 'kitchen' },
    ]
  },
  {
    id: 'security',
    name: 'Security',
    isActive: true,
    devices: [
      { id: 's-front-door', name: 'Front Door', type: 'lock', isOn: true, room: 'security' },
      { id: 's-camera-1', name: 'Front Camera', type: 'camera', isOn: true, room: 'security' },
      { id: 's-camera-2', name: 'Back Camera', type: 'camera', isOn: true, room: 'security' },
      { id: 's-wifi', name: 'WiFi Network', type: 'wifi', isOn: true, room: 'security' },
    ]
  }
]

const recentActions = [
  { action: 'Turned on Living Room TV', time: '2 minutes ago', room: 'Living Room' },
  { action: 'Dimmed Bedroom Light to 45%', time: '15 minutes ago', room: 'Bedroom' },
  { action: 'Set Kitchen Speaker volume to 60%', time: '1 hour ago', room: 'Kitchen' },
  { action: 'Locked Front Door', time: '2 hours ago', room: 'Security' },
  { action: 'Adjusted Thermostat to 22°C', time: '3 hours ago', room: 'Living Room' },
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
                <h2 className="text-xl font-semibold text-[var(--fg)]">Smart Home</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="h-full overflow-y-auto pb-20">
              {/* Quick Stats */}
              <div className="p-4 border-b border-[var(--border)]">
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[var(--bg-secondary)] rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-[var(--accent)]">12</div>
                    <div className="text-xs text-[var(--fg-secondary)]">Active Devices</div>
                  </div>
                  <div className="bg-[var(--bg-secondary)] rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-[var(--success)]">3</div>
                    <div className="text-xs text-[var(--fg-secondary)]">Rooms Active</div>
                  </div>
                  <div className="bg-[var(--bg-secondary)] rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-[var(--warning)]">22°C</div>
                    <div className="text-xs text-[var(--fg-secondary)]">Avg Temp</div>
                  </div>
                </div>
              </div>

              {/* Recent Actions */}
              <div className="p-4 border-b border-[var(--border)]">
                <h3 className="text-lg font-semibold text-[var(--fg)] mb-3">Recent Actions</h3>
                <div className="space-y-2">
                  {recentActions.slice(0, 3).map((action, index) => (
                    <div key={index} className="bg-[var(--bg-secondary)] rounded-xl p-3">
                      <div className="text-sm text-[var(--fg)]">{action.action}</div>
                      <div className="text-xs text-[var(--fg-muted)] mt-1">
                        {action.room} • {action.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rooms */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-[var(--fg)] mb-3">Rooms</h3>
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
                              {room.devices.filter(d => d.isOn).length}/{room.devices.length} devices on
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}