import TaskItem from './TaskItem'

function TaskList({ tasks, onToggle, onDelete, formatDueDateTime }) {
  if (tasks.length === 0) {
    return <p className="empty-state">No tasks found for this filter.</p>
  }

  return (
    <ul className="todo-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          dueText={formatDueDateTime(task)}
        />
      ))}
    </ul>
  )
}

export default TaskList
