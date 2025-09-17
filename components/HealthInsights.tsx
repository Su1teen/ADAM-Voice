"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { 
  Activity, 
  Heart, 
  Moon, 
  Thermometer,
  TrendingUp,
  Calendar,
  X,
  ChevronRight,
  Zap,
  Shield,
  Clock
} from 'react-feather'

interface HealthMetric {
  id: string
  name: string
  value: string | number
  unit?: string
  trend: 'up' | 'down' | 'stable'
  status: 'good' | 'warning' | 'danger'
  icon: React.ReactNode
}

interface HealthInsightsProps {
  isVisible: boolean
  onClose: () => void
}

const healthMetrics: HealthMetric[] = [
  {
    id: 'sleep',
    name: 'Sleep Quality',
    value: '8.2',
    unit: 'hrs',
    trend: 'up',
    status: 'good',
    icon: <Moon size={20} />
  },
  {
    id: 'heart-rate',
    name: 'Avg Heart Rate',
    value: 68,
    unit: 'bpm',
    trend: 'stable',
    status: 'good',
    icon: <Heart size={20} />
  },
  {
    id: 'steps',
    name: 'Daily Steps',
    value: '12,450',
    unit: 'steps',
    trend: 'up',
    status: 'good',
    icon: <Activity size={20} />
  },
  {
    id: 'temperature',
    name: 'Body Temp',
    value: '36.6',
    unit: '°C',
    trend: 'stable',
    status: 'good',
    icon: <Thermometer size={20} />
  }
]

const sleepData = {
  totalSleep: '8h 15m',
  deepSleep: '2h 30m',
  lightSleep: '4h 45m',
  remSleep: '1h 00m',
  bedtime: '23:30',
  wakeTime: '07:45',
  sleepScore: 87
}

const healthTips = [
  {
    title: 'Great Sleep Pattern!',
    description: 'You\'ve maintained consistent sleep for 7 days. Keep it up!',
    type: 'achievement'
  },
  {
    title: 'Stay Hydrated',
    description: 'Your room temperature is slightly high. Consider drinking more water.',
    type: 'tip'
  },
  {
    title: 'Active Day Ahead',
    description: 'Weather is perfect for outdoor activities. Plan a walk!',
    type: 'suggestion'
  }
]

const weeklyActivity = [
  { day: 'Mon', steps: 8500, sleep: 7.5 },
  { day: 'Tue', steps: 12200, sleep: 8.2 },
  { day: 'Wed', steps: 10800, sleep: 7.8 },
  { day: 'Thu', steps: 9600, sleep: 8.0 },
  { day: 'Fri', steps: 11400, sleep: 7.2 },
  { day: 'Sat', steps: 15200, sleep: 8.5 },
  { day: 'Sun', steps: 12450, sleep: 8.2 }
]

const getStatusColor = (status: HealthMetric['status']) => {
  switch (status) {
    case 'good': return 'text-[var(--success)]'
    case 'warning': return 'text-[var(--warning)]'
    case 'danger': return 'text-[var(--error)]'
    default: return 'text-[var(--fg-secondary)]'
  }
}

const getTrendIcon = (trend: HealthMetric['trend']) => {
  switch (trend) {
    case 'up': return <TrendingUp size={12} className="text-[var(--success)]" />
    case 'down': return <TrendingUp size={12} className="text-[var(--error)] rotate-180" />
    case 'stable': return <div className="w-3 h-0.5 bg-[var(--fg-muted)] rounded" />
  }
}

export default function HealthInsights({ isVisible, onClose }: HealthInsightsProps) {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'sleep' | 'activity'>('overview')

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
                <Activity size={24} className="text-[var(--accent)]" />
                <h2 className="text-xl font-semibold text-[var(--fg)]">Health & Insights</h2>
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
                { id: 'overview', label: 'Overview', icon: <Activity size={16} /> },
                { id: 'sleep', label: 'Sleep', icon: <Moon size={16} /> },
                { id: 'activity', label: 'Activity', icon: <Zap size={16} /> }
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
              {/* Overview Tab */}
              {selectedTab === 'overview' && (
                <div className="p-4 space-y-6">
                  {/* Health Metrics Grid */}
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--fg)] mb-3">Today's Health</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {healthMetrics.map((metric) => (
                        <motion.div
                          key={metric.id}
                          whileHover={{ scale: 1.02 }}
                          className="bg-[var(--bg-secondary)] rounded-xl p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className={`p-2 rounded-lg ${getStatusColor(metric.status).replace('text-', 'bg-').replace(']', '/10]')}`}>
                              {metric.icon}
                            </div>
                            {getTrendIcon(metric.trend)}
                          </div>
                          <div className="text-xl font-bold text-[var(--fg)]">
                            {metric.value}
                            {metric.unit && <span className="text-sm text-[var(--fg-secondary)] ml-1">{metric.unit}</span>}
                          </div>
                          <div className="text-xs text-[var(--fg-secondary)]">{metric.name}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Health Tips */}
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--fg)] mb-3">Insights & Tips</h3>
                    <div className="space-y-3">
                      {healthTips.map((tip, index) => (
                        <div key={index} className="bg-[var(--bg-secondary)] rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${
                              tip.type === 'achievement' ? 'bg-[var(--success)]/10' :
                              tip.type === 'tip' ? 'bg-[var(--warning)]/10' :
                              'bg-[var(--accent)]/10'
                            }`}>
                              {tip.type === 'achievement' ? <Shield size={16} /> :
                               tip.type === 'tip' ? <Heart size={16} /> :
                               <TrendingUp size={16} />}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-[var(--fg)]">{tip.title}</div>
                              <div className="text-sm text-[var(--fg-secondary)] mt-1">{tip.description}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Sleep Tab */}
              {selectedTab === 'sleep' && (
                <div className="p-4 space-y-6">
                  {/* Sleep Score */}
                  <div className="bg-[var(--bg-secondary)] rounded-xl p-4 text-center">
                    <div className="text-4xl font-bold text-[var(--accent)] mb-2">{sleepData.sleepScore}</div>
                    <div className="text-sm text-[var(--fg-secondary)]">Sleep Score</div>
                    <div className="text-xs text-[var(--success)] mt-1">Excellent</div>
                  </div>

                  {/* Sleep Breakdown */}
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--fg)] mb-3">Last Night</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center bg-[var(--bg-secondary)] rounded-xl p-3">
                        <span className="text-[var(--fg-secondary)]">Total Sleep</span>
                        <span className="font-semibold text-[var(--fg)]">{sleepData.totalSleep}</span>
                      </div>
                      <div className="flex justify-between items-center bg-[var(--bg-secondary)] rounded-xl p-3">
                        <span className="text-[var(--fg-secondary)]">Deep Sleep</span>
                        <span className="font-semibold text-[var(--success)]">{sleepData.deepSleep}</span>
                      </div>
                      <div className="flex justify-between items-center bg-[var(--bg-secondary)] rounded-xl p-3">
                        <span className="text-[var(--fg-secondary)]">Light Sleep</span>
                        <span className="font-semibold text-[var(--accent)]">{sleepData.lightSleep}</span>
                      </div>
                      <div className="flex justify-between items-center bg-[var(--bg-secondary)] rounded-xl p-3">
                        <span className="text-[var(--fg-secondary)]">REM Sleep</span>
                        <span className="font-semibold text-[var(--warning)]">{sleepData.remSleep}</span>
                      </div>
                    </div>
                  </div>

                  {/* Sleep Schedule */}
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--fg)] mb-3">Schedule</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[var(--bg-secondary)] rounded-xl p-4 text-center">
                        <Clock size={20} className="mx-auto mb-2 text-[var(--accent)]" />
                        <div className="text-lg font-bold text-[var(--fg)]">{sleepData.bedtime}</div>
                        <div className="text-xs text-[var(--fg-secondary)]">Bedtime</div>
                      </div>
                      <div className="bg-[var(--bg-secondary)] rounded-xl p-4 text-center">
                        <Activity size={20} className="mx-auto mb-2 text-[var(--success)]" />
                        <div className="text-lg font-bold text-[var(--fg)]">{sleepData.wakeTime}</div>
                        <div className="text-xs text-[var(--fg-secondary)]">Wake Time</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Activity Tab */}
              {selectedTab === 'activity' && (
                <div className="p-4 space-y-6">
                  {/* Weekly Chart */}
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--fg)] mb-3">Weekly Activity</h3>
                    <div className="bg-[var(--bg-secondary)] rounded-xl p-4">
                      <div className="flex justify-between items-end h-32 mb-4">
                        {weeklyActivity.map((day, index) => (
                          <div key={day.day} className="flex flex-col items-center gap-2">
                            <div 
                              className="w-6 bg-[var(--accent)] rounded-t"
                              style={{ height: `${(day.steps / 16000) * 80}px` }}
                            />
                            <span className="text-xs text-[var(--fg-secondary)]">{day.day}</span>
                          </div>
                        ))}
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[var(--fg)]">12,450</div>
                        <div className="text-sm text-[var(--fg-secondary)]">Steps Today</div>
                      </div>
                    </div>
                  </div>

                  {/* Activity Goals */}
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--fg)] mb-3">Daily Goals</h3>
                    <div className="space-y-3">
                      <div className="bg-[var(--bg-secondary)] rounded-xl p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[var(--fg)]">Steps</span>
                          <span className="text-sm text-[var(--fg-secondary)]">12,450 / 10,000</span>
                        </div>
                        <div className="w-full bg-[var(--bg-tertiary)] rounded-full h-2">
                          <div className="bg-[var(--success)] h-2 rounded-full" style={{ width: '100%' }} />
                        </div>
                      </div>
                      <div className="bg-[var(--bg-secondary)] rounded-xl p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[var(--fg)]">Active Minutes</span>
                          <span className="text-sm text-[var(--fg-secondary)]">45 / 30</span>
                        </div>
                        <div className="w-full bg-[var(--bg-tertiary)] rounded-full h-2">
                          <div className="bg-[var(--accent)] h-2 rounded-full" style={{ width: '100%' }} />
                        </div>
                      </div>
                      <div className="bg-[var(--bg-secondary)] rounded-xl p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[var(--fg)]">Calories</span>
                          <span className="text-sm text-[var(--fg-secondary)]">1,850 / 2,200</span>
                        </div>
                        <div className="w-full bg-[var(--bg-tertiary)] rounded-full h-2">
                          <div className="bg-[var(--warning)] h-2 rounded-full" style={{ width: '84%' }} />
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