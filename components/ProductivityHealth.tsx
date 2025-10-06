"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  Activity, 
  Heart, 
  Moon, 
  CheckCircle,
  Circle,
  Calendar as CalendarIcon,
  Clock,
  X,
  Plus,
  TrendingUp,
  Zap,
  Target,
  List,
  AlertCircle,
  Edit3,
  Trash2,
  MoreVertical
} from 'react-feather'

interface Task {
  id: string
  title: string
  description?: string
  priority: 'high' | 'medium' | 'low'
  completed: boolean
  dueDate: string
  dueTime?: string
  category: 'work' | 'personal' | 'health' | 'learning'
  aiGenerated: boolean
  estimatedDuration?: number // in minutes
}

interface CalendarEvent {
  id: string
  title: string
  startTime: string
  endTime: string
  date: string
  type: 'meeting' | 'task' | 'break' | 'health'
  color: string
  aiScheduled: boolean
}

interface HealthMetric {
  name: string
  value: string | number
  unit?: string
  status: 'good' | 'warning' | 'danger'
  icon: React.ReactNode
}

interface ProductivityHealthProps {
  isVisible: boolean
  onClose: () => void
}

export default function ProductivityHealth({ isVisible, onClose }: ProductivityHealthProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'calendar' | 'health'>('overview')
  const [showAddTask, setShowAddTask] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  // Tasks state
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Завершить презентацию для клиента',
      description: 'Подготовить слайды и демонстрацию продукта',
      priority: 'high',
      completed: false,
      dueDate: '2025-10-02',
      dueTime: '15:00',
      category: 'work',
      aiGenerated: false,
      estimatedDuration: 120
    },
    {
      id: '2',
      title: 'Тренировка в зале',
      description: 'Кардио + силовые упражнения',
      priority: 'medium',
      completed: false,
      dueDate: '2025-10-02',
      dueTime: '18:00',
      category: 'health',
      aiGenerated: true,
      estimatedDuration: 60
    },
    {
      id: '3',
      title: 'Проверить email и ответить на важные письма',
      priority: 'medium',
      completed: true,
      dueDate: '2025-10-02',
      dueTime: '09:00',
      category: 'work',
      aiGenerated: false,
      estimatedDuration: 30
    },
    {
      id: '4',
      title: 'Изучить новый фреймворк React',
      description: 'Пройти первые 3 модуля онлайн курса',
      priority: 'low',
      completed: false,
      dueDate: '2025-10-03',
      category: 'learning',
      aiGenerated: true,
      estimatedDuration: 90
    },
    {
      id: '5',
      title: 'Медитация и дыхательные упражнения',
      priority: 'medium',
      completed: false,
      dueDate: '2025-10-02',
      dueTime: '20:00',
      category: 'health',
      aiGenerated: true,
      estimatedDuration: 15
    },
    {
      id: '6',
      title: 'Встреча с командой - еженедельный sync',
      priority: 'high',
      completed: false,
      dueDate: '2025-10-02',
      dueTime: '14:00',
      category: 'work',
      aiGenerated: false,
      estimatedDuration: 45
    }
  ])

  // Calendar events
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Утренняя встреча команды',
      startTime: '09:00',
      endTime: '09:30',
      date: '2025-10-02',
      type: 'meeting',
      color: '#0A84FF',
      aiScheduled: false
    },
    {
      id: '2',
      title: 'Проверка email',
      startTime: '09:30',
      endTime: '10:00',
      date: '2025-10-02',
      type: 'task',
      color: '#64D2FF',
      aiScheduled: true
    },
    {
      id: '3',
      title: 'Фокус время: Презентация',
      startTime: '10:00',
      endTime: '12:00',
      date: '2025-10-02',
      type: 'task',
      color: '#FF9F0A',
      aiScheduled: true
    },
    {
      id: '4',
      title: 'Обеденный перерыв',
      startTime: '12:00',
      endTime: '13:00',
      date: '2025-10-02',
      type: 'break',
      color: '#30D158',
      aiScheduled: true
    },
    {
      id: '5',
      title: 'Встреча с командой',
      startTime: '14:00',
      endTime: '14:45',
      date: '2025-10-02',
      type: 'meeting',
      color: '#0A84FF',
      aiScheduled: false
    },
    {
      id: '6',
      title: 'Подготовка к презентации',
      startTime: '15:00',
      endTime: '17:00',
      date: '2025-10-02',
      type: 'task',
      color: '#FF9F0A',
      aiScheduled: true
    },
    {
      id: '7',
      title: 'Тренировка',
      startTime: '18:00',
      endTime: '19:00',
      date: '2025-10-02',
      type: 'health',
      color: '#BF5AF2',
      aiScheduled: true
    },
    {
      id: '8',
      title: 'Медитация',
      startTime: '20:00',
      endTime: '20:15',
      date: '2025-10-02',
      type: 'health',
      color: '#BF5AF2',
      aiScheduled: true
    }
  ])

  // Health metrics
  const healthMetrics: HealthMetric[] = [
    {
      name: 'Сон',
      value: '7ч 32м',
      status: 'good',
      icon: <Moon size={18} />
    },
    {
      name: 'Пульс',
      value: 68,
      unit: 'уд/мин',
      status: 'good',
      icon: <Heart size={18} />
    },
    {
      name: 'Шаги',
      value: '8,456',
      status: 'good',
      icon: <Activity size={18} />
    },
    {
      name: 'Энергия',
      value: 85,
      unit: '%',
      status: 'good',
      icon: <Zap size={18} />
    }
  ]

  // Productivity stats
  const productivityStats = {
    tasksCompleted: tasks.filter(t => t.completed).length,
    tasksTotal: tasks.length,
    focusTime: 245, // minutes today
    streakDays: 12,
    aiSuggestionsUsed: tasks.filter(t => t.aiGenerated && t.completed).length
  }

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ))
  }

  const addTask = () => {
    if (!newTaskTitle.trim()) return
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      priority: 'medium',
      completed: false,
      dueDate: new Date().toISOString().split('T')[0],
      category: 'work',
      aiGenerated: false
    }
    
    setTasks(prev => [newTask, ...prev])
    setNewTaskTitle('')
    setShowAddTask(false)
  }

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
  }

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'text-apple-red'
      case 'medium': return 'text-apple-orange'
      case 'low': return 'text-apple-blue'
      default: return 'text-[var(--text-secondary)]'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'work': return '💼'
      case 'personal': return '👤'
      case 'health': return '💪'
      case 'learning': return '📚'
      default: return '📋'
    }
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    return `${hours}:${minutes}`
  }

  const getTodayEvents = () => {
    const today = new Date().toISOString().split('T')[0]
    return events.filter(e => e.date === today).sort((a, b) => a.startTime.localeCompare(b.startTime))
  }

  const getTodayTasks = () => {
    const today = new Date().toISOString().split('T')[0]
    return tasks.filter(t => t.dueDate === today).sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1
      if (a.priority !== b.priority) {
        const priorityOrder = { high: 0, medium: 1, low: 2 }
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      }
      return 0
    })
  }

  const getUpcomingTasks = () => {
    const today = new Date().toISOString().split('T')[0]
    return tasks.filter(t => t.dueDate > today && !t.completed)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 5)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Optimized Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 z-40"
            onClick={onClose}
            style={{ willChange: 'opacity' }}
          />

          {/* Optimized Productivity & Health Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ 
              type: 'tween',
              duration: 0.3,
              ease: [0.32, 0.72, 0, 1]
            }}
            className="fixed right-0 top-0 h-full w-full sm:w-[480px] lg:w-[560px] glass-panel rounded-l-3xl shadow-apple-xl z-50 flex flex-col"
            style={{ 
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--border-base)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-apple-purple/20 to-apple-blue/20 flex items-center justify-center">
                  <Target size={20} className="text-apple-purple" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">Продуктивность и Здоровье</h2>
                  <p className="text-xs text-[var(--text-tertiary)]">ИИ-ассистент для задач и здоровья</p>
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
                { id: 'overview', label: 'Обзор', icon: <Target size={16} /> },
                { id: 'tasks', label: 'Задачи', icon: <CheckCircle size={16} /> },
                { id: 'calendar', label: 'Календарь', icon: <CalendarIcon size={16} /> },
                { id: 'health', label: 'Здоровье', icon: <Heart size={16} /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'glass-button-accent'
                      : 'glass-button'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
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
                  {/* Productivity Stats */}
                  <div className="glass-card p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-[var(--text-primary)]">Продуктивность Сегодня</h3>
                      <Zap size={20} className="text-apple-orange" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-xs text-[var(--text-tertiary)] mb-1">Задачи</div>
                        <div className="text-2xl font-bold text-[var(--text-primary)]">
                          {productivityStats.tasksCompleted}/{productivityStats.tasksTotal}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-[var(--text-tertiary)] mb-1">Фокус-время</div>
                        <div className="text-2xl font-bold text-[var(--text-primary)]">
                          {Math.floor(productivityStats.focusTime / 60)}ч {productivityStats.focusTime % 60}м
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-[var(--border-thin)]">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-apple-blue/20 flex items-center justify-center">
                          <TrendingUp size={16} className="text-apple-blue" />
                        </div>
                        <div>
                          <div className="text-xs text-[var(--text-tertiary)]">Серия дней</div>
                          <div className="text-sm font-semibold text-[var(--text-primary)]">{productivityStats.streakDays} дней</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-[var(--text-tertiary)]">ИИ предложения</div>
                        <div className="text-sm font-semibold text-apple-purple">{productivityStats.aiSuggestionsUsed} использовано</div>
                      </div>
                    </div>
                  </div>

                  {/* Health Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {healthMetrics.map((metric, idx) => (
                      <motion.div
                        key={idx}
                        className="glass-card p-4"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`${metric.status === 'good' ? 'text-apple-green' : 'text-apple-orange'}`}>
                            {metric.icon}
                          </div>
                          <span className="text-xs text-[var(--text-tertiary)]">{metric.name}</span>
                        </div>
                        <div className="text-xl font-semibold text-[var(--text-primary)]">
                          {metric.value}{metric.unit && <span className="text-sm text-[var(--text-tertiary)] ml-1">{metric.unit}</span>}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Today's Schedule Preview */}
                  <div className="glass-card p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-[var(--text-primary)]">Расписание на Сегодня</h3>
                      <Clock size={18} className="text-apple-blue" />
                    </div>
                    <div className="space-y-2">
                      {getTodayEvents().slice(0, 4).map((event) => (
                        <div key={event.id} className="flex items-center gap-3 py-2">
                          <div className="flex-shrink-0 w-1 h-10 rounded-full" style={{ backgroundColor: event.color }} />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-[var(--text-primary)] truncate">{event.title}</div>
                            <div className="text-xs text-[var(--text-tertiary)]">
                              {formatTime(event.startTime)} - {formatTime(event.endTime)}
                              {event.aiScheduled && <span className="ml-2 text-apple-purple">✨ ИИ</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Suggestions */}
                  <div className="glass-card p-4 bg-gradient-to-br from-apple-purple/10 to-transparent border-apple-purple/20">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-apple-purple/20 flex items-center justify-center flex-shrink-0">
                        <Zap size={16} className="text-apple-purple" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                          ИИ Рекомендация
                        </h4>
                        <p className="text-xs text-[var(--text-secondary)] mb-2">
                          У вас есть 2 часа свободного времени завтра с 15:00. Хотите запланировать изучение React?
                        </p>
                        <div className="flex gap-2">
                          <button className="px-3 py-1 rounded-lg text-xs font-medium bg-apple-purple/20 text-apple-purple">
                            Запланировать
                          </button>
                          <button className="px-3 py-1 rounded-lg text-xs font-medium glass-button">
                            Позже
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tasks Tab */}
              {activeTab === 'tasks' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Add Task Button */}
                  <button
                    onClick={() => setShowAddTask(!showAddTask)}
                    className="w-full glass-button-accent py-3 text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Plus size={18} />
                    Добавить Задачу
                  </button>

                  {/* Add Task Form */}
                  <AnimatePresence>
                    {showAddTask && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="glass-card p-4"
                      >
                        <input
                          type="text"
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addTask()}
                          placeholder="Название задачи..."
                          className="glass-input w-full mb-3"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button onClick={addTask} className="flex-1 glass-button-accent py-2 text-sm">
                            Создать
                          </button>
                          <button onClick={() => setShowAddTask(false)} className="flex-1 glass-button py-2 text-sm">
                            Отмена
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Tasks List - Today */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                      <CalendarIcon size={16} />
                      Сегодня ({getTodayTasks().length})
                    </h3>
                    {getTodayTasks().map((task) => (
                      <motion.div
                        key={task.id}
                        className={`glass-card p-4 ${task.completed ? 'opacity-60' : ''}`}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleTask(task.id)}
                            className="flex-shrink-0 mt-0.5"
                          >
                            {task.completed ? (
                              <CheckCircle size={20} className="text-apple-green" />
                            ) : (
                              <Circle size={20} className="text-[var(--text-tertiary)]" />
                            )}
                          </button>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm">{getCategoryIcon(task.category)}</span>
                              <h4 className={`text-sm font-medium ${task.completed ? 'line-through text-[var(--text-tertiary)]' : 'text-[var(--text-primary)]'}`}>
                                {task.title}
                              </h4>
                              {task.aiGenerated && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-apple-purple/20 text-apple-purple">
                                  ИИ
                                </span>
                              )}
                            </div>
                            
                            {task.description && (
                              <p className="text-xs text-[var(--text-tertiary)] mb-2">{task.description}</p>
                            )}
                            
                            <div className="flex items-center gap-3 text-xs">
                              {task.dueTime && (
                                <span className="flex items-center gap-1 text-[var(--text-tertiary)]">
                                  <Clock size={12} />
                                  {formatTime(task.dueTime)}
                                </span>
                              )}
                              {task.estimatedDuration && (
                                <span className="text-[var(--text-tertiary)]">
                                  {task.estimatedDuration}мин
                                </span>
                              )}
                              <span className={`font-medium ${getPriorityColor(task.priority)}`}>
                                {task.priority === 'high' && '🔴 Высокий'}
                                {task.priority === 'medium' && '🟠 Средний'}
                                {task.priority === 'low' && '🔵 Низкий'}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => deleteTask(task.id)}
                            className="flex-shrink-0 p-1 hover:bg-[var(--glass-light)] rounded-lg transition-colors"
                          >
                            <Trash2 size={16} className="text-[var(--text-tertiary)]" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Upcoming Tasks */}
                  {getUpcomingTasks().length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                        <List size={16} />
                        Скоро ({getUpcomingTasks().length})
                      </h3>
                      {getUpcomingTasks().map((task) => (
                        <motion.div
                          key={task.id}
                          className="glass-card p-3"
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className="flex items-center gap-3">
                            <button onClick={() => toggleTask(task.id)}>
                              <Circle size={18} className="text-[var(--text-tertiary)]" />
                            </button>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs">{getCategoryIcon(task.category)}</span>
                                <h4 className="text-sm font-medium text-[var(--text-primary)] truncate">{task.title}</h4>
                              </div>
                              <p className="text-xs text-[var(--text-tertiary)]">
                                {new Date(task.dueDate).toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' })}
                              </p>
                            </div>
                            <button onClick={() => deleteTask(task.id)}>
                              <Trash2 size={14} className="text-[var(--text-tertiary)]" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Calendar Tab */}
              {activeTab === 'calendar' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Current Time */}
                  <div className="glass-card p-5 bg-gradient-to-br from-apple-blue/10 to-transparent border-apple-blue/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                          {currentTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)]">
                          {currentTime.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                      </div>
                      <CalendarIcon size={32} className="text-apple-blue" />
                    </div>
                  </div>

                  {/* Today's Events Timeline */}
                  <div className="glass-card p-4">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Расписание на Сегодня</h3>
                    <div className="space-y-3">
                      {getTodayEvents().map((event, idx) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-start gap-3"
                        >
                          <div className="flex-shrink-0 w-16 text-right">
                            <div className="text-sm font-medium text-[var(--text-primary)]">{formatTime(event.startTime)}</div>
                            <div className="text-xs text-[var(--text-tertiary)]">{formatTime(event.endTime)}</div>
                          </div>
                          
                          <div className="flex-shrink-0 flex flex-col items-center">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: event.color }} />
                            {idx < getTodayEvents().length - 1 && (
                              <div className="w-0.5 h-full min-h-[40px] bg-[var(--border-thin)] my-1" />
                            )}
                          </div>
                          
                          <div className="flex-1 glass-surface rounded-xl p-3 mb-2">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-medium text-[var(--text-primary)]">{event.title}</h4>
                              {event.aiScheduled && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-apple-purple/20 text-apple-purple">
                                  ✨ ИИ
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
                              <span>
                                {event.type === 'meeting' && '👥 Встреча'}
                                {event.type === 'task' && '📋 Задача'}
                                {event.type === 'break' && '☕ Перерыв'}
                                {event.type === 'health' && '💪 Здоровье'}
                              </span>
                              <span>•</span>
                              <span>{Math.round((new Date(`2000-01-01 ${event.endTime}`).getTime() - new Date(`2000-01-01 ${event.startTime}`).getTime()) / 60000)} мин</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* AI Scheduling Info */}
                  <div className="glass-card p-4 bg-gradient-to-br from-apple-purple/10 to-transparent border-apple-purple/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap size={16} className="text-apple-purple" />
                      <h4 className="text-sm font-semibold text-[var(--text-primary)]">Умное Планирование</h4>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mb-3">
                      ИИ автоматически планирует перерывы, фокус-время и задачи на основе ваших приоритетов и энергии.
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--text-tertiary)]">Событий от ИИ:</span>
                      <span className="font-semibold text-apple-purple">
                        {events.filter(e => e.aiScheduled).length} из {events.length}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Health Tab */}
              {activeTab === 'health' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Health Summary */}
                  <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Состояние Здоровья</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {healthMetrics.map((metric, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className={metric.status === 'good' ? 'text-apple-green' : 'text-apple-orange'}>
                              {metric.icon}
                            </div>
                            <span className="text-xs text-[var(--text-tertiary)]">{metric.name}</span>
                          </div>
                          <div className="text-2xl font-bold text-[var(--text-primary)]">
                            {metric.value}
                            {metric.unit && <span className="text-sm text-[var(--text-tertiary)] ml-1">{metric.unit}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sleep Details */}
                  <div className="glass-card p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-[var(--text-primary)]">Качество Сна</h3>
                      <Moon size={20} className="text-apple-blue" />
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-end gap-2 mb-2">
                        <div className="text-3xl font-bold text-[var(--text-primary)]">7ч 32м</div>
                        <div className="text-sm text-apple-green mb-1">+12мин</div>
                      </div>
                      <div className="text-xs text-[var(--text-tertiary)]">
                        23:30 → 07:02
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[var(--text-tertiary)]">Глубокий сон</span>
                          <span className="text-[var(--text-primary)] font-medium">2ч 15м</span>
                        </div>
                        <div className="h-2 bg-[var(--glass-light)] rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-apple-blue to-apple-purple w-[30%]" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[var(--text-tertiary)]">Легкий сон</span>
                          <span className="text-[var(--text-primary)] font-medium">4ч 20м</span>
                        </div>
                        <div className="h-2 bg-[var(--glass-light)] rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-apple-teal to-apple-blue w-[57%]" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[var(--text-tertiary)]">REM сон</span>
                          <span className="text-[var(--text-primary)] font-medium">57м</span>
                        </div>
                        <div className="h-2 bg-[var(--glass-light)] rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-apple-purple to-apple-pink w-[13%]" />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-[var(--border-thin)]">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[var(--text-tertiary)]">Оценка сна</span>
                        <span className="text-lg font-bold text-apple-green">87/100</span>
                      </div>
                    </div>
                  </div>

                  {/* Activity */}
                  <div className="glass-card p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-[var(--text-primary)]">Активность</h3>
                      <Activity size={20} className="text-apple-green" />
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-[var(--text-secondary)]">Шаги</span>
                          <span className="text-sm font-semibold text-[var(--text-primary)]">8,456 / 10,000</span>
                        </div>
                        <div className="h-2 bg-[var(--glass-light)] rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-apple-green to-apple-teal w-[85%]" />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center">
                          <div className="text-xs text-[var(--text-tertiary)] mb-1">Калории</div>
                          <div className="text-lg font-semibold text-[var(--text-primary)]">524</div>
                          <div className="text-xs text-[var(--text-tertiary)]">ккал</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-[var(--text-tertiary)] mb-1">Активность</div>
                          <div className="text-lg font-semibold text-[var(--text-primary)]">45</div>
                          <div className="text-xs text-[var(--text-tertiary)]">мин</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-[var(--text-tertiary)] mb-1">Расстояние</div>
                          <div className="text-lg font-semibold text-[var(--text-primary)]">6.2</div>
                          <div className="text-xs text-[var(--text-tertiary)]">км</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Health Tips */}
                  <div className="glass-card p-4 bg-gradient-to-br from-apple-green/10 to-transparent border-apple-green/20">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-apple-green/20 flex items-center justify-center flex-shrink-0">
                        <Heart size={16} className="text-apple-green" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                          Отличная активность!
                        </h4>
                        <p className="text-xs text-[var(--text-secondary)]">
                          Вы поддерживаете активность 12 дней подряд. Не забудьте запланировать тренировку на 18:00.
                        </p>
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
