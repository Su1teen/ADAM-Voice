"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { X, Zap, Droplet, Wind, Sun, TrendingDown, TrendingUp, Activity, AlertCircle, Check } from 'react-feather'

interface BuildingAutomationProps {
  isVisible: boolean
  onClose: () => void
}

interface ResourceData {
  current: number
  target: number
  unit: string
  status: 'optimal' | 'high' | 'low'
  trend: 'up' | 'down' | 'stable'
  savings: number
}

interface BuildingZone {
  id: string
  name: string
  floor: number
  temperature: number
  humidity: number
  occupancy: number
  lighting: number
  hvacStatus: 'on' | 'off' | 'auto'
  powerUsage: number
}

export default function BuildingAutomation({ isVisible, onClose }: BuildingAutomationProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'zones' | 'energy' | 'automation'>('overview')

  // Resource monitoring data
  const resources: Record<string, ResourceData> = {
    power: {
      current: 245.8,
      target: 200.0,
      unit: 'кВт',
      status: 'high',
      trend: 'down',
      savings: 18.5
    },
    water: {
      current: 156.2,
      target: 180.0,
      unit: 'л/ч',
      status: 'optimal',
      trend: 'stable',
      savings: 22.3
    },
    gas: {
      current: 42.5,
      target: 50.0,
      unit: 'м³/ч',
      status: 'optimal',
      trend: 'down',
      savings: 15.8
    },
    hvac: {
      current: 87.5,
      target: 85.0,
      unit: 'кВт',
      status: 'high',
      trend: 'up',
      savings: 12.4
    }
  }

  // Building zones
  const [zones, setZones] = useState<BuildingZone[]>([
    { id: '1', name: 'Офис А - Этаж 1', floor: 1, temperature: 22.5, humidity: 45, occupancy: 12, lighting: 80, hvacStatus: 'auto', powerUsage: 45.2 },
    { id: '2', name: 'Офис Б - Этаж 1', floor: 1, temperature: 23.0, humidity: 48, occupancy: 8, lighting: 65, hvacStatus: 'on', powerUsage: 38.7 },
    { id: '3', name: 'Конференц-зал - Этаж 1', floor: 1, temperature: 21.8, humidity: 42, occupancy: 0, lighting: 20, hvacStatus: 'auto', powerUsage: 12.5 },
    { id: '4', name: 'Офис В - Этаж 1', floor: 1, temperature: 22.2, humidity: 46, occupancy: 15, lighting: 90, hvacStatus: 'auto', powerUsage: 52.8 }
  ])

  // Automation rules
  const [automationRules, setAutomationRules] = useState([
    { id: '1', name: 'Энергосбережение в нерабочее время', active: true, schedule: '18:00 - 08:00', savings: '25%' },
    { id: '2', name: 'Автоматическое освещение по датчикам', active: true, schedule: 'Постоянно', savings: '18%' },
    { id: '3', name: 'Оптимизация HVAC по занятости', active: true, schedule: 'Постоянно', savings: '22%' },
    { id: '4', name: 'Снижение температуры ночью', active: true, schedule: '22:00 - 06:00', savings: '15%' },
    { id: '5', name: 'Отключение неиспользуемого оборудования', active: false, schedule: 'Постоянно', savings: '12%' }
  ])

  const toggleAutomationRule = (id: string) => {
    setAutomationRules(prev => prev.map(rule => 
      rule.id === id ? { ...rule, active: !rule.active } : rule
    ))
  }

  const updateZoneHVAC = (zoneId: string, status: 'on' | 'off' | 'auto') => {
    setZones(prev => prev.map(zone => 
      zone.id === zoneId ? { ...zone, hvacStatus: status } : zone
    ))
  }

  const getResourceIcon = (type: string) => {
    switch(type) {
      case 'power': return <Zap size={20} />
      case 'water': return <Droplet size={20} />
      case 'gas': return <Wind size={20} />
      case 'hvac': return <Sun size={20} />
      default: return <Activity size={20} />
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'optimal': return 'text-apple-green'
      case 'high': return 'text-apple-orange'
      case 'low': return 'text-apple-blue'
      default: return 'text-[var(--text-secondary)]'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch(trend) {
      case 'up': return <TrendingUp size={16} className="text-apple-red" />
      case 'down': return <TrendingDown size={16} className="text-apple-green" />
      default: return <div className="w-4 h-0.5 bg-[var(--text-tertiary)]" />
    }
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

          {/* Building Automation Panel */}
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
                  <Activity size={20} className="text-apple-blue" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">Автоматизация Здания</h2>
                  <p className="text-xs text-[var(--text-tertiary)]">Управление ресурсами и системами</p>
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
            <div className="flex gap-2 p-4 border-b border-[var(--border-base)] overflow-x-auto scrollbar-hide">
              {[
                { id: 'overview', label: 'Обзор' },
                { id: 'zones', label: 'Зоны' },
                { id: 'energy', label: 'Энергия' },
                { id: 'automation', label: 'Автоматизация' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'glass-button-accent'
                      : 'glass-button'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Resource Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(resources).map(([key, data]) => (
                      <motion.div
                        key={key}
                        className="glass-card p-3 sm:p-4"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center gap-2 mb-2 sm:mb-3">
                          <div className={`${getStatusColor(data.status)} flex-shrink-0`}>
                            {getResourceIcon(key)}
                          </div>
                          <span className="text-[10px] sm:text-xs font-medium text-[var(--text-secondary)] uppercase leading-tight truncate">
                            {key === 'power' && 'Электр-во'}
                            {key === 'water' && 'Вода'}
                            {key === 'gas' && 'Газ'}
                            {key === 'hvac' && 'Кондиц-е'}
                          </span>
                        </div>
                        <div className="flex items-end justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="text-xl sm:text-2xl font-semibold text-[var(--text-primary)] truncate">
                              {data.current}
                            </div>
                            <div className="text-xs text-[var(--text-tertiary)] truncate">
                              {data.unit}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                            {getTrendIcon(data.trend)}
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[var(--border-thin)]">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[var(--text-tertiary)]">Экономия</span>
                            <span className="text-apple-green font-medium">↓ {data.savings}%</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* System Status */}
                  <div className="glass-card p-4">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Статус Систем</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-apple-green animate-pulse" />
                          <span className="text-sm text-[var(--text-secondary)]">HVAC Система</span>
                        </div>
                        <span className="text-xs font-medium text-apple-green">Работает</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-apple-green animate-pulse" />
                          <span className="text-sm text-[var(--text-secondary)]">Освещение</span>
                        </div>
                        <span className="text-xs font-medium text-apple-green">Оптимизировано</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-apple-orange animate-pulse" />
                          <span className="text-sm text-[var(--text-secondary)]">Водоснабжение</span>
                        </div>
                        <span className="text-xs font-medium text-apple-orange">Внимание</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-apple-green animate-pulse" />
                          <span className="text-sm text-[var(--text-secondary)]">Безопасность</span>
                        </div>
                        <span className="text-xs font-medium text-apple-green">Активна</span>
                      </div>
                    </div>
                  </div>

                  {/* Alerts */}
                  <div className="glass-card p-4 bg-gradient-to-br from-apple-orange/10 to-transparent border-apple-orange/20">
                    <div className="flex items-start gap-3">
                      <AlertCircle size={20} className="text-apple-orange flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                          Повышенное потребление электроэнергии
                        </h4>
                        <p className="text-xs text-[var(--text-secondary)] mb-2">
                          Обнаружено превышение на 18.5% от целевого показателя в офисе В.
                        </p>
                        <button className="text-xs font-medium text-apple-orange">
                          Просмотреть детали →
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Zones Tab */}
              {activeTab === 'zones' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  {zones.map((zone) => (
                    <motion.div
                      key={zone.id}
                      className="glass-card p-4"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-sm font-semibold text-[var(--text-primary)]">{zone.name}</h4>
                          <p className="text-xs text-[var(--text-tertiary)]">Занятость: {zone.occupancy} чел.</p>
                        </div>
                        <div className="flex gap-1">
                          {['auto', 'on', 'off'].map((status) => (
                            <button
                              key={status}
                              onClick={() => updateZoneHVAC(zone.id, status as any)}
                              className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                                zone.hvacStatus === status
                                  ? 'bg-apple-blue text-white'
                                  : 'glass-button'
                              }`}
                            >
                              {status === 'auto' && 'Авто'}
                              {status === 'on' && 'Вкл'}
                              {status === 'off' && 'Выкл'}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div>
                          <div className="text-xs text-[var(--text-tertiary)] mb-1">Температура</div>
                          <div className="text-lg font-semibold text-[var(--text-primary)]">{zone.temperature}°C</div>
                        </div>
                        <div>
                          <div className="text-xs text-[var(--text-tertiary)] mb-1">Влажность</div>
                          <div className="text-lg font-semibold text-[var(--text-primary)]">{zone.humidity}%</div>
                        </div>
                        <div>
                          <div className="text-xs text-[var(--text-tertiary)] mb-1">Освещение</div>
                          <div className="text-lg font-semibold text-[var(--text-primary)]">{zone.lighting}%</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-[var(--border-thin)]">
                        <span className="text-xs text-[var(--text-tertiary)]">Потребление</span>
                        <span className="text-sm font-semibold text-[var(--text-primary)]">{zone.powerUsage} кВт</span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Energy Tab */}
              {activeTab === 'energy' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Energy Overview */}
                  <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Энергопотребление Сегодня</h3>
                    <div className="text-4xl font-bold text-[var(--text-primary)] mb-2">245.8 кВт·ч</div>
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingDown size={16} className="text-apple-green" />
                      <span className="text-sm text-apple-green font-medium">↓ 12.4% от вчера</span>
                    </div>
                    
                    {/* Simple bar chart */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[var(--text-tertiary)]">Серверная</span>
                          <span className="text-[var(--text-primary)] font-medium">95.6 кВт</span>
                        </div>
                        <div className="h-2 bg-[var(--glass-light)] rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-apple-blue to-apple-purple w-[39%]" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[var(--text-tertiary)]">Офис В</span>
                          <span className="text-[var(--text-primary)] font-medium">52.8 кВт</span>
                        </div>
                        <div className="h-2 bg-[var(--glass-light)] rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-apple-blue to-apple-teal w-[21%]" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[var(--text-tertiary)]">Офис А</span>
                          <span className="text-[var(--text-primary)] font-medium">45.2 кВт</span>
                        </div>
                        <div className="h-2 bg-[var(--glass-light)] rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-apple-green to-apple-teal w-[18%]" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[var(--text-tertiary)]">Офис Б</span>
                          <span className="text-[var(--text-primary)] font-medium">38.7 кВт</span>
                        </div>
                        <div className="h-2 bg-[var(--glass-light)] rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-apple-teal to-apple-blue w-[16%]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cost Savings */}
                  <div className="glass-card p-5 bg-gradient-to-br from-apple-green/10 to-transparent border-apple-green/20">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingDown size={20} className="text-apple-green" />
                      <h3 className="text-sm font-semibold text-[var(--text-primary)]">Экономия Средств</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-[var(--text-tertiary)] mb-1">За месяц</div>
                        <div className="text-2xl font-bold text-apple-green">124,580 тг</div>
                      </div>
                      <div>
                        <div className="text-xs text-[var(--text-tertiary)] mb-1">За год (прогноз)</div>
                        <div className="text-2xl font-bold text-apple-green">914,960 тг</div>
                      </div>
                    </div>
                  </div>

                  {/* Peak Hours */}
                  <div className="glass-card p-4">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Пиковые Часы</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-[var(--text-secondary)]">09:00 - 12:00</span>
                        <span className="text-sm font-semibold text-apple-orange">Высокая</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-[var(--text-secondary)]">14:00 - 18:00</span>
                        <span className="text-sm font-semibold text-apple-orange">Высокая</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-[var(--text-secondary)]">00:00 - 06:00</span>
                        <span className="text-sm font-semibold text-apple-green">Низкая</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Automation Tab */}
              {activeTab === 'automation' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="glass-card p-4 bg-gradient-to-br from-apple-blue/10 to-transparent border-apple-blue/20 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-apple-blue/20 flex items-center justify-center flex-shrink-0">
                        <Check size={20} className="text-apple-blue" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                          Автоматизация Активна
                        </h4>
                        <p className="text-xs text-[var(--text-secondary)]">
                          5 правил работают для оптимизации потребления ресурсов
                        </p>
                      </div>
                    </div>
                  </div>

                  {automationRules.map((rule) => (
                    <motion.div
                      key={rule.id}
                      className="glass-card p-4"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-[var(--text-primary)] mb-1">{rule.name}</h4>
                          <p className="text-xs text-[var(--text-tertiary)]">{rule.schedule}</p>
                        </div>
                        <button
                          onClick={() => toggleAutomationRule(rule.id)}
                          className={`ml-3 w-11 h-6 rounded-full transition-all duration-300 flex items-center ${
                            rule.active ? 'bg-apple-blue' : 'bg-[var(--glass-medium)]'
                          }`}
                        >
                          <motion.div
                            className="w-5 h-5 rounded-full bg-white shadow-md"
                            animate={{ x: rule.active ? 22 : 2 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-[var(--glass-light)] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-apple-green to-apple-teal rounded-full"
                            style={{ width: rule.savings }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-apple-green">{rule.savings}</span>
                      </div>
                    </motion.div>
                  ))}

                  <button className="w-full glass-button py-3 text-sm font-medium mt-4">
                    + Добавить Правило
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
