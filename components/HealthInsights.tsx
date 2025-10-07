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
    name: 'Качество сна',
    value: '8.2',
    unit: 'час',
    trend: 'up',
    status: 'good',
    icon: <Moon size={20} />
  },
  {
    id: 'heart-rate',
    name: 'Средний пульс',
    value: 68,
    unit: 'уд/мин',
    trend: 'stable',
    status: 'good',
    icon: <Heart size={20} />
  },
  {
    id: 'steps',
    name: 'Шаги за день',
    value: '12,450',
    unit: 'шагов',
    trend: 'up',
    status: 'good',
    icon: <Activity size={20} />
  },
  {
    id: 'temperature',
    name: 'Темп. тела',
    value: '36.6',
    unit: '°C',
    trend: 'stable',
    status: 'good',
    icon: <Thermometer size={20} />
  }
]

const sleepData = {
  totalSleep: '8ч 15м',
  deepSleep: '2ч 30м',
  lightSleep: '4ч 45м',
  remSleep: '1ч 00м',
  bedtime: '23:30',
  wakeTime: '07:45',
  sleepScore: 87
}

const healthTips = [
  {
    title: 'Отличный режим сна!',
    description: 'Вы поддерживаете стабильный сон 7 дней. Продолжайте в том же духе!',
    type: 'achievement'
  },
  {
    title: 'Пейте больше воды',
    description: 'Температура в комнате немного повышена. Рекомендуем пить больше воды.',
    type: 'tip'
  },
  {
    title: 'Активный день впереди',
    description: 'Погода идеальна для прогулок на свежем воздухе. Запланируйте прогулку!',
    type: 'suggestion'
  }
]

const weeklyActivity = [
  { day: 'Пн', steps: 8500, sleep: 7.5, heartRate: 65, calories: 1950 },
  { day: 'Вт', steps: 12200, sleep: 8.2, heartRate: 68, calories: 2150 },
  { day: 'Ср', steps: 10800, sleep: 7.8, heartRate: 72, calories: 2050 },
  { day: 'Чт', steps: 9600, sleep: 8.0, heartRate: 69, calories: 1980 },
  { day: 'Пт', steps: 11400, sleep: 7.2, heartRate: 75, calories: 2100 },
  { day: 'Сб', steps: 15200, sleep: 8.5, heartRate: 63, calories: 2300 },
  { day: 'Вс', steps: 12450, sleep: 8.2, heartRate: 67, calories: 2000 }
]

const stressLevels = [
  { time: '06:00', level: 15 },
  { time: '09:00', level: 45 },
  { time: '12:00', level: 35 },
  { time: '15:00', level: 65 },
  { time: '18:00', level: 40 },
  { time: '21:00', level: 25 },
  { time: '00:00', level: 10 }
]

const healthGoals = [
  { name: 'Шаги в день', current: 12450, target: 10000, unit: 'шагов', achieved: true },
  { name: 'Часы сна', current: 8.2, target: 8.0, unit: 'часов', achieved: true },
  { name: 'Потребление воды', current: 6, target: 8, unit: 'стаканов', achieved: false },
  { name: 'Активные минуты', current: 45, target: 30, unit: 'минут', achieved: true },
  { name: 'Медитация', current: 15, target: 20, unit: 'минут', achieved: false }
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
  const [selectedTab, setSelectedTab] = useState<'overview' | 'sleep' | 'activity' | 'stress'>('overview')

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black/70"
          onClick={onClose}
          style={{ willChange: 'opacity' }}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ 
              type: 'tween',
              duration: 0.3,
              ease: [0.32, 0.72, 0, 1]
            }}
            className="mobile-scroll-container absolute right-0 top-0 bottom-0 w-full max-w-md"
            style={{ 
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)'
            }}
          >
            <div className="h-full p-4">
              <div className="h-full glass-panel border-l shadow-2xl overflow-hidden rounded-3xl flex flex-col">
            {/* Header */}
            <div className="glass-surface flex items-center justify-between p-4 border-b border-[var(--border-glass)]">
              <div className="flex items-center gap-3">
                <Activity size={24} className="text-[var(--accent)]" />
                <h2 className="text-xl font-semibold text-[var(--fg)]">Здоровье и аналитика</h2>
              </div>
              <button
                onClick={onClose}
                className="glass-button p-2 transition-all duration-300 active:scale-95"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div className="glass-frosted flex border-b border-[var(--border-glass)]">
              {[
                { id: 'overview', label: 'Обзор', icon: <Activity size={16} /> },
                { id: 'sleep', label: 'Сон', icon: <Moon size={16} /> },
                { id: 'activity', label: 'Активность', icon: <Zap size={16} /> },
                { id: 'stress', label: 'Самочувствие', icon: <Heart size={16} /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`flex-1 p-3 flex items-center justify-center gap-2 transition-all duration-300 relative ${
                    selectedTab === tab.id
                      ? 'text-[var(--accent)]'
                      : 'text-[var(--fg-secondary)]'
                  }`}
                >
                  {selectedTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-light)]" />
                  )}
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
                    <h3 className="text-lg font-semibold text-[var(--fg)] mb-3">Здоровье сегодня</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {healthMetrics.map((metric) => (
                        <div
                          key={metric.id}
                          className="bg-[var(--bg-secondary)] rounded-xl p-4 transition-transform active:scale-95"
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
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Health Tips */}
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--fg)] mb-3">Советы и рекомендации</h3>
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
                    <div className="text-sm text-[var(--fg-secondary)]">Оценка сна</div>
                    <div className="text-xs text-[var(--success)] mt-1">Отлично</div>
                  </div>

                  {/* Sleep Breakdown */}
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--fg)] mb-3">Прошлая ночь</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center bg-[var(--bg-secondary)] rounded-xl p-3">
                        <span className="text-[var(--fg-secondary)]">Общее время сна</span>
                        <span className="font-semibold text-[var(--fg)]">{sleepData.totalSleep}</span>
                      </div>
                      <div className="flex justify-between items-center bg-[var(--bg-secondary)] rounded-xl p-3">
                        <span className="text-[var(--fg-secondary)]">Глубокий сон</span>
                        <span className="font-semibold text-[var(--success)]">{sleepData.deepSleep}</span>
                      </div>
                      <div className="flex justify-between items-center bg-[var(--bg-secondary)] rounded-xl p-3">
                        <span className="text-[var(--fg-secondary)]">Лёгкий сон</span>
                        <span className="font-semibold text-[var(--accent)]">{sleepData.lightSleep}</span>
                      </div>
                      <div className="flex justify-between items-center bg-[var(--bg-secondary)] rounded-xl p-3">
                        <span className="text-[var(--fg-secondary)]">Быстрый сон</span>
                        <span className="font-semibold text-[var(--warning)]">{sleepData.remSleep}</span>
                      </div>
                    </div>
                  </div>

                  {/* Sleep Schedule */}
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--fg)] mb-3">Расписание</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[var(--bg-secondary)] rounded-xl p-4 text-center">
                        <Clock size={20} className="mx-auto mb-2 text-[var(--accent)]" />
                        <div className="text-lg font-bold text-[var(--fg)]">{sleepData.bedtime}</div>
                        <div className="text-xs text-[var(--fg-secondary)]">Отбой ко сну</div>
                      </div>
                      <div className="bg-[var(--bg-secondary)] rounded-xl p-4 text-center">
                        <Activity size={20} className="mx-auto mb-2 text-[var(--success)]" />
                        <div className="text-lg font-bold text-[var(--fg)]">{sleepData.wakeTime}</div>
                        <div className="text-xs text-[var(--fg-secondary)]">Пробуждение</div>
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
                    <h3 className="text-lg font-semibold text-[var(--fg)] mb-3">Недельная активность</h3>
                    <div className="bg-[var(--bg-secondary)] rounded-xl p-4">
                      <div className="flex justify-between items-end h-32 mb-4">
                        {weeklyActivity.map((day, index) => (
                          <div key={day.day} className="flex flex-col items-center gap-2">
                            <div 
                              className="w-6 bg-[var(--accent)] rounded-t transition-all hover:bg-[var(--accent-light)]"
                              style={{ height: `${(day.steps / 16000) * 80}px` }}
                              title={`${day.steps} steps`}
                            />
                            <span className="text-xs text-[var(--fg-secondary)]">{day.day}</span>
                          </div>
                        ))}
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[var(--fg)]">{weeklyActivity[6].steps.toLocaleString()}</div>
                        <div className="text-sm text-[var(--fg-secondary)]">Шагов сегодня</div>
                      </div>
                    </div>
                  </div>

                  {/* Heart Rate Trend */}
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--fg)] mb-3">Тренд пульса</h3>
                    <div className="bg-[var(--bg-secondary)] rounded-xl p-4">
                      <div className="flex justify-between items-end h-20 mb-4">
                        {weeklyActivity.map((day, index) => (
                          <div key={day.day} className="flex flex-col items-center gap-2">
                            <div 
                              className="w-4 bg-[var(--success)] rounded-t"
                              style={{ height: `${((day.heartRate - 50) / 30) * 60}px` }}
                              title={`${day.heartRate} bpm`}
                            />
                            <span className="text-xs text-[var(--fg-secondary)]">{day.day}</span>
                          </div>
                        ))}
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[var(--fg)]">{weeklyActivity[6].heartRate}</div>
                        <div className="text-sm text-[var(--fg-secondary)]">Средний пульс</div>
                      </div>
                    </div>
                  </div>

                  {/* Activity Goals */}
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--fg)] mb-3">Ежедневные цели</h3>
                    <div className="space-y-3">
                      {healthGoals.map((goal, index) => (
                        <div key={goal.name} className="bg-[var(--bg-secondary)] rounded-xl p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[var(--fg)]">{goal.name}</span>
                            <span className="text-sm text-[var(--fg-secondary)]">
                              {goal.current} / {goal.target} {goal.unit}
                            </span>
                          </div>
                          <div className="w-full bg-[var(--bg-tertiary)] rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${
                                goal.achieved ? 'bg-[var(--success)]' : 'bg-[var(--warning)]'
                              }`} 
                              style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }} 
                            />
                          </div>
                          {goal.achieved && (
                            <div className="text-xs text-[var(--success)] mt-1">✓ Цель достигнута!</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Wellness Tab */}
              {selectedTab === 'stress' && (
                <div className="p-4 space-y-6">
                  {/* Stress Level Chart */}
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--fg)] mb-3">Уровень стресса сегодня</h3>
                    <div className="bg-[var(--bg-secondary)] rounded-xl p-4">
                      <div className="flex justify-between items-end h-24 mb-4">
                        {stressLevels.map((point, index) => (
                          <div key={point.time} className="flex flex-col items-center gap-2">
                            <div 
                              className={`w-3 rounded-t ${
                                point.level <= 30 ? 'bg-[var(--success)]' :
                                point.level <= 60 ? 'bg-[var(--warning)]' :
                                'bg-[var(--error)]'
                              }`}
                              style={{ height: `${(point.level / 100) * 80}px` }}
                              title={`${point.level}% stress at ${point.time}`}
                            />
                            <span className="text-xs text-[var(--fg-secondary)]">{point.time}</span>
                          </div>
                        ))}
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[var(--success)]">Низкий</div>
                        <div className="text-sm text-[var(--fg-secondary)]">Текущий уровень стресса</div>
                      </div>
                    </div>
                  </div>

                  {/* Wellness Metrics */}
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--fg)] mb-3">Оценка самочувствия</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[var(--bg-secondary)] rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-[var(--success)] mb-2">85</div>
                        <div className="text-sm text-[var(--fg-secondary)]">Общее самочувствие</div>
                        <div className="text-xs text-[var(--success)] mt-1">Отлично</div>
                      </div>
                      <div className="bg-[var(--bg-secondary)] rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-[var(--accent)] mb-2">92</div>
                        <div className="text-sm text-[var(--fg-secondary)]">Качество сна</div>
                        <div className="text-xs text-[var(--success)] mt-1">Превосходно</div>
                      </div>
                      <div className="bg-[var(--bg-secondary)] rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-[var(--warning)] mb-2">68</div>
                        <div className="text-sm text-[var(--fg-secondary)]">Гидратация</div>
                        <div className="text-xs text-[var(--warning)] mt-1">Требует внимания</div>
                      </div>
                      <div className="bg-[var(--bg-secondary)] rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-[var(--success)] mb-2">78</div>
                        <div className="text-sm text-[var(--fg-secondary)]">Психическое здоровье</div>
                        <div className="text-xs text-[var(--success)] mt-1">Хорошо</div>
                      </div>
                    </div>
                  </div>

                  {/* Mindfulness */}
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--fg)] mb-3">Осознанность</h3>
                    <div className="space-y-3">
                      <div className="bg-[var(--bg-secondary)] rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[var(--fg)] font-medium">Дыхательное упражнение</span>
                          <button className="px-3 py-1 bg-[var(--accent)] text-white rounded-lg text-sm">Начать</button>
                        </div>
                        <div className="text-xs text-[var(--fg-secondary)]">5 минут • Снятие стресса</div>
                      </div>
                      <div className="bg-[var(--bg-secondary)] rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[var(--fg)] font-medium">Сеанс медитации</span>
                          <button className="px-3 py-1 bg-[var(--accent)] text-white rounded-lg text-sm">Начать</button>
                        </div>
                        <div className="text-xs text-[var(--fg-secondary)]">15 минут • Фокус и ясность</div>
                      </div>
                      <div className="bg-[var(--bg-secondary)] rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[var(--fg)] font-medium">Убаюкивающие истории</span>
                          <button className="px-3 py-1 bg-[var(--accent)] text-white rounded-lg text-sm">Слушать</button>
                        </div>
                        <div className="text-xs text-[var(--fg-secondary)]">20 минут • Лучший сон</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}