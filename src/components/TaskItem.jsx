function TaskItem({ task, onToggle, onDelete, dueText }) {
  return (
    <li className={task.completed ? 'todo-item done' : 'todo-item'}>
      <div className="todo-item-main">
        <input
          className="task-checkbox"
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          aria-label={`Mark ${task.title} as complete`}
        />
        <div className="task-content">
          <h3>{task.title}</h3>
          {task.description ? <p>{task.description}</p> : null}
          <div className="task-meta">
            <span className="due-time">{dueText}</span>
            <span className={task.completed ? 'status-pill complete' : 'status-pill pending'}>
              {task.completed ? 'Completed' : 'Pending'}
            </span>
          </div>
        </div>
      </div>
      <button className="delete-btn" type="button" onClick={() => onDelete(task.id)}>
        Delete
      </button>
    </li>
  )
}

export default TaskItem
