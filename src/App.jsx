import { useEffect, useMemo, useState } from 'react'
import './App.css'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'

const STORAGE_KEY = 'todo-app-tasks-v1'
const TASKS_PER_PAGE = 5

const createTaskId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : String(Date.now() + Math.random())

const createDummyTasks = (count = 20) => {
  const now = new Date()

  return Array.from({ length: count }, (_, index) => {
    const dayOffset = index - 2
    const due = new Date(now)
    due.setDate(now.getDate() + dayOffset)

    const paddedMonth = String(due.getMonth() + 1).padStart(2, '0')
    const paddedDay = String(due.getDate()).padStart(2, '0')
    const dueDate = `${due.getFullYear()}-${paddedMonth}-${paddedDay}`
    const dueTime = `${String(9 + (index % 8)).padStart(2, '0')}:${
      index % 2 === 0 ? '00' : '30'
    }`

    return {
      id: createTaskId(),
      title: `Sample Task ${index + 1}`,
      description: `This is a demo task to help preview the app layout and pagination behavior.`,
      dueDate,
      dueTime,
      completed: index % 4 === 0,
      createdAt: new Date(now.getTime() - index * 3600000).toISOString(),
    }
  })
}

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [dueTime, setDueTime] = useState('')
  const [filter, setFilter] = useState('all')
  const [visibleCount, setVisibleCount] = useState(TASKS_PER_PAGE)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem(STORAGE_KEY)
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks)
        if (Array.isArray(parsedTasks)) {
          setTasks(parsedTasks)
        } else {
          setTasks(createDummyTasks(20))
        }
      } else {
        setTasks(createDummyTasks(20))
      }
    } catch (error) {
      console.error('Unable to load tasks from localStorage.', error)
      setTasks(createDummyTasks(20))
    } finally {
      setIsHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!isHydrated) {
      return
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks, isHydrated])

  useEffect(() => {
    setVisibleCount(TASKS_PER_PAGE)
  }, [filter])

  const handleAddTask = (event) => {
    event.preventDefault()

    if (!title.trim()) {
      return
    }

    const newTask = {
      id: createTaskId(),
      title: title.trim(),
      description: description.trim(),
      dueDate,
      dueTime,
      completed: false,
      createdAt: new Date().toISOString(),
    }

    setTasks((prevTasks) => [newTask, ...prevTasks])
    setTitle('')
    setDescription('')
    setDueDate('')
    setDueTime('')
  }

  const handleToggleTask = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  const handleDeleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
  }

  const handleClearCompleted = () => {
    setTasks((prevTasks) => prevTasks.filter((task) => !task.completed))
  }

  const filteredTasks = useMemo(() => {
    const sortedTasks = [...tasks].sort((a, b) => {
      const aDue = a.dueDate ? new Date(`${a.dueDate}T${a.dueTime || '23:59'}`) : null
      const bDue = b.dueDate ? new Date(`${b.dueDate}T${b.dueTime || '23:59'}`) : null

      if (aDue && bDue) {
        return aDue - bDue
      }
      if (aDue) {
        return -1
      }
      if (bDue) {
        return 1
      }

      return new Date(b.createdAt) - new Date(a.createdAt)
    })

    if (filter === 'active') {
      return sortedTasks.filter((task) => !task.completed)
    }
    if (filter === 'completed') {
      return sortedTasks.filter((task) => task.completed)
    }
    return sortedTasks
  }, [tasks, filter])

  const completedCount = tasks.filter((task) => task.completed).length
  const visibleTasks = filteredTasks.slice(0, visibleCount)
  const canLoadMore = filteredTasks.length > visibleCount

  const formatDueDateTime = (task) => {
    if (!task.dueDate) {
      return 'No deadline'
    }
    const dateAndTime = `${task.dueDate}T${task.dueTime || '00:00'}`
    const parsedDate = new Date(dateAndTime)
    if (Number.isNaN(parsedDate.getTime())) {
      return 'Invalid date/time'
    }
    return parsedDate.toLocaleString([], {
      dateStyle: 'medium',
      timeStyle: task.dueTime ? 'short' : undefined,
    })
  }

  return (
    <main className="app">
      <div className="todo-container">
        <header className="todo-header">
          <h1>Todo List</h1>
          <p>Plan your day with date &amp; time based tasks.</p>
        </header>

        <TaskForm
          title={title}
          description={description}
          dueDate={dueDate}
          dueTime={dueTime}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onDueDateChange={setDueDate}
          onDueTimeChange={setDueTime}
          onSubmit={handleAddTask}
        />

        <section className="todo-controls">
          <div className="filters" role="group" aria-label="Filter tasks">
            <button
              className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
              type="button"
              onClick={() => setFilter('all')}
            >
              All ({tasks.length})
            </button>
            <button
              className={filter === 'active' ? 'filter-btn active' : 'filter-btn'}
              type="button"
              onClick={() => setFilter('active')}
            >
              Active ({tasks.length - completedCount})
            </button>
            <button
              className={filter === 'completed' ? 'filter-btn active' : 'filter-btn'}
              type="button"
              onClick={() => setFilter('completed')}
            >
              Completed ({completedCount})
            </button>
          </div>
          <button
            className="danger-btn"
            type="button"
            onClick={handleClearCompleted}
            disabled={completedCount === 0}
          >
            Clear Completed
          </button>
        </section>

        <section className="todo-list-section">
          <TaskList
            tasks={visibleTasks}
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
            formatDueDateTime={formatDueDateTime}
          />
          {canLoadMore ? (
            <div className="pagination-wrap">
              <button
                className="load-more-btn"
                type="button"
                onClick={() => setVisibleCount((prevCount) => prevCount + TASKS_PER_PAGE)}
              >
                Load More
              </button>
              <p className="pagination-info">
                Showing {visibleTasks.length} of {filteredTasks.length} tasks
              </p>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  )
}

export default App
