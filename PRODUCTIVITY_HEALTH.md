# Productivity & Health Component

## Overview
The **Productivity & Health** component has replaced the previous "Health & Analytics" panel. This is a comprehensive AI-powered productivity and wellness hub that combines task management, calendar scheduling, and health monitoring in one professional interface.

## Component Location
- **File**: `components/ProductivityHealth.tsx`
- **Usage**: Imported in `app/c/[slug]/page.tsx`
- **Navigation Button**: 4th button (Activity icon) - labeled "Продуктивность"

## Key Features

### 1. **Overview Tab (Обзор)**
A dashboard view combining productivity and health metrics:

#### Productivity Stats
- **Tasks Completed**: Shows progress (e.g., 1/6 tasks)
- **Focus Time**: Tracks concentrated work time (e.g., 4h 5m today)
- **Streak Days**: Consecutive days of productivity (e.g., 12 days)
- **AI Suggestions Used**: How many AI-generated tasks were completed

#### Health Metrics Grid
- **Sleep**: 7h 32m with status indicator
- **Heart Rate**: 68 bpm with health status
- **Steps**: 8,456 steps tracked
- **Energy**: 85% energy level

#### Today's Schedule Preview
- Shows next 4 upcoming events
- Color-coded by type (meeting, task, break, health)
- Displays time range and duration
- AI-scheduled events marked with ✨ icon

#### AI Recommendation Card
- Smart suggestions based on your schedule
- Example: "You have 2 hours of free time tomorrow at 15:00. Want to schedule React learning?"
- Quick action buttons: "Schedule" or "Later"

---

### 2. **Tasks Tab (Задачи)**
Full task management system with AI assistance:

#### Add Task Feature
- Quick add button with modal form
- Input field with Enter key support
- Creates tasks with default medium priority

#### Task Properties
Each task includes:
- **Title & Description**: What needs to be done
- **Priority**: High (🔴), Medium (🟠), Low (🔵)
- **Due Date & Time**: When it's due
- **Category**: Work 💼, Personal 👤, Health 💪, Learning 📚
- **Estimated Duration**: How long it will take (e.g., 120 minutes)
- **AI Generated**: Badge showing if AI created the task
- **Completion Status**: Checkbox to mark complete

#### Task Organization
- **Today Section**: Tasks due today, sorted by:
  1. Incomplete tasks first
  2. Priority (high → medium → low)
  3. Then completed tasks (faded)
- **Upcoming Section**: Next 5 future tasks
- Strike-through styling for completed tasks
- Delete button for task removal

#### Sample Tasks
1. **Complete client presentation** (High, Work, 2h, 15:00)
2. **Gym workout** (Medium, Health, 1h, 18:00) - AI Generated
3. **Check emails** (Medium, Work, 30m, 09:00) - Completed
4. **Learn React framework** (Low, Learning, 1.5h, Tomorrow)
5. **Meditation** (Medium, Health, 15m, 20:00) - AI Generated
6. **Team sync meeting** (High, Work, 45m, 14:00)

---

### 3. **Calendar Tab (Календарь)**
AI-powered schedule visualization:

#### Current Time Display
- Large clock showing current time (HH:MM)
- Full date with weekday in Russian (e.g., "четверг, 2 октября")
- Gradient card with blue accent

#### Timeline View
- All today's events in chronological order
- Time-based layout:
  - Left: Start time → End time
  - Center: Visual timeline with colored dots and connecting lines
  - Right: Event card with details

#### Event Details
- **Title**: Event name
- **Type Icon**: 
  - 👥 Meeting
  - 📋 Task
  - ☕ Break
  - 💪 Health
- **Duration**: Calculated in minutes
- **AI Scheduled Badge**: ✨ ИИ for AI-created events
- **Color Coding**:
  - Blue (#0A84FF): Meetings
  - Cyan (#64D2FF): Tasks
  - Orange (#FF9F0A): Focus/Work time
  - Green (#30D158): Breaks
  - Purple (#BF5AF2): Health activities

#### Sample Schedule (Today)
- **09:00-09:30**: Morning team meeting
- **09:30-10:00**: Email check (AI)
- **10:00-12:00**: Focus time: Presentation (AI)
- **12:00-13:00**: Lunch break (AI)
- **14:00-14:45**: Team meeting
- **15:00-17:00**: Presentation preparation (AI)
- **18:00-19:00**: Workout (AI)
- **20:00-20:15**: Meditation (AI)

#### AI Scheduling Info Card
- Shows how many events are AI-scheduled
- Explains AI logic: "AI automatically schedules breaks, focus time, and tasks based on your priorities and energy"
- Stats: "6 out of 8 events from AI"

---

### 4. **Health Tab (Здоровье)**
Comprehensive health monitoring:

#### Health Summary
Four key metrics displayed in a grid:
- **Sleep**: 7h 32m
- **Heart Rate**: 68 bpm
- **Steps**: 8,456
- **Energy**: 85%

#### Sleep Quality Details
- **Total Sleep**: 7h 32m (+12min improvement)
- **Sleep Window**: 23:30 → 07:02
- **Sleep Phases** with progress bars:
  - **Deep Sleep**: 2h 15m (30% - Blue/Purple gradient)
  - **Light Sleep**: 4h 20m (57% - Teal/Blue gradient)
  - **REM Sleep**: 57m (13% - Purple/Pink gradient)
- **Sleep Score**: 87/100 (Green, indicating good quality)

#### Activity Tracking
- **Steps Progress**: 8,456 / 10,000 (85% complete)
  - Green/Teal gradient progress bar
- **Calories**: 524 kcal burned
- **Active Time**: 45 minutes
- **Distance**: 6.2 km traveled

#### Health Tips
- Achievement-based encouragement
- Example: "Great activity! You've maintained activity for 12 days in a row. Don't forget to schedule your workout at 18:00."
- Green card with heart icon

---

## Design System

### Apple Liquid Glass Theme
- **Glass Morphism**: `backdrop-filter: blur(32px)` with `saturate(180%)`
- **Colors**: Pure black (#000000) background with Apple color accents
- **Typography**: SF Pro Display font family
- **Border Radius**: 20px for cards, 12px for buttons
- **Shadows**: Multi-layered Apple-style shadows

### Color Coding
- **Blue** (#0A84FF): Primary actions, meetings, information
- **Green** (#30D158): Success, health, positive metrics
- **Orange** (#FF9F0A): Focus time, warnings, medium priority
- **Red** (#FF453A): High priority, urgent tasks
- **Purple** (#BF5AF2): AI features, REM sleep, health activities
- **Teal** (#64D2FF): Light elements, secondary actions

### Animations
- **Framer Motion**: Spring physics for smooth transitions
- **Page Transitions**: Slide from right (spring damping: 30, stiffness: 300)
- **Hover Effects**: Scale 1.02 on cards, 1.05 on buttons
- **Tap Effects**: Scale 0.9 for tactile feedback
- **Staggered Lists**: 0.05s delay between items

---

## Functional Features

### State Management
```typescript
const [tasks, setTasks] = useState<Task[]>([...])
const [events, setEvents] = useState<CalendarEvent[]>([...])
const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'calendar' | 'health'>('overview')
const [showAddTask, setShowAddTask] = useState(false)
const [currentTime, setCurrentTime] = useState(new Date())
```

### Real-Time Updates
- **Clock**: Updates every minute
- **Task Completion**: Instant toggle with state update
- **Task Creation**: Adds to list with current date
- **Task Deletion**: Removes from list with animation

### Data Interfaces
```typescript
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
  estimatedDuration?: number // minutes
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
```

---

## AI Integration Points

### Current AI Features
1. **Task Generation**: AI can create tasks based on patterns
2. **Smart Scheduling**: AI schedules breaks, focus time, and tasks
3. **Recommendations**: Suggests optimal times for activities
4. **Priority Detection**: AI helps determine task importance

### Future AI Enhancements
1. **Voice Task Creation**: Create tasks via voice command
2. **Smart Rescheduling**: AI moves tasks when conflicts arise
3. **Energy Optimization**: Schedule tasks based on energy levels
4. **Health Insights**: AI analyzes health trends and suggests improvements
5. **Meeting Preparation**: AI prepares briefs before meetings
6. **Learning Path**: AI creates personalized learning schedules

---

## Usage in Application

### Navigation
The component is accessed via the 4th navigation button:
- **Icon**: Activity (target/pulse icon)
- **Label**: "Продуктивность"
- **Position**: Between "Smart Home" and "Chat" buttons
- **Shortcut**: Click Activity icon at bottom-right navigation

### Panel Behavior
- **Opens from right**: Slides in with spring animation
- **Full height**: Takes entire viewport height
- **Responsive width**: 100% on mobile, 480px on small screens, 560px on large screens
- **Backdrop**: Dark blur overlay (60% black with backdrop-blur)
- **Close methods**: 
  1. X button in header
  2. Click backdrop
  3. Click Activity button again (toggle)

### Integration with Other Components
- **Closes other panels**: When opened, closes Smart Home, Chat, Settings, Building Automation
- **State management**: Uses `showHealthInsights` state variable
- **Independent**: Can be used standalone or with other features

---

## Russian Language Interface

All text is in Russian for consistency:
- **Tabs**: Обзор, Задачи, Календарь, Здоровье
- **Stats**: Продуктивность Сегодня, Задачи, Фокус-время, Серия дней
- **Health**: Сон, Пульс, Шаги, Энергия
- **Actions**: Добавить Задачу, Создать, Отмена, Запланировать, Позже
- **Days**: понедельник, вторник, среда, четверг, пятница, суббота, воскресенье
- **Months**: января, февраля, марта, апреля, мая, июня, июля, августа, сентября, октября, ноября, декабря

---

## Component Structure

### File Size
- **Lines**: ~1000 lines
- **Dependencies**: framer-motion, react-feather
- **Complexity**: High (multiple tabs, state management, real-time updates)

### Performance Optimizations
- **Memoization**: Could add React.memo for child components
- **Lazy Loading**: Calendar events only loaded for today
- **Filter Functions**: Efficient task and event filtering
- **State Updates**: Minimal re-renders with targeted state changes

### Accessibility
- **Keyboard Navigation**: Tab through buttons
- **ARIA Labels**: Title attributes on buttons
- **Color Contrast**: Meets WCAG guidelines
- **Focus States**: Visible focus indicators
- **Screen Reader**: Semantic HTML structure

---

## Comparison with Previous Component

### Old: HealthInsights
- Single focus on health metrics
- Static data display
- Basic health tips
- 4 metrics only
- No interaction beyond viewing

### New: ProductivityHealth
- **4 tabs**: Overview, Tasks, Calendar, Health
- **Task management**: Add, complete, delete tasks
- **AI scheduling**: Intelligent calendar automation
- **Real-time updates**: Clock, task completion
- **Rich interactions**: Toggle tasks, add new items
- **Comprehensive data**: 6 tasks, 8 calendar events, 4 health metrics, sleep details, activity tracking
- **AI integration**: Smart suggestions and recommendations
- **Professional design**: Apple Liquid Glass with animations

---

## Summary

The **Productivity & Health** component is a complete productivity hub that combines:
- ✅ AI-powered task management
- ✅ Intelligent calendar scheduling
- ✅ Comprehensive health monitoring
- ✅ Real-time updates and interactions
- ✅ Professional Apple design language
- ✅ Smooth animations and transitions
- ✅ Full Russian language interface
- ✅ Mobile-responsive layout

It transforms the basic health panel into a **full-featured productivity assistant** powered by AI, while maintaining the elegant Apple Liquid Glass aesthetic throughout the ADAM-Voice application.
