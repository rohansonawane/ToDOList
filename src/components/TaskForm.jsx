function TaskForm({
  title,
  description,
  dueDate,
  dueTime,
  onTitleChange,
  onDescriptionChange,
  onDueDateChange,
  onDueTimeChange,
  onSubmit,
}) {
  return (
    <form className="todo-form" onSubmit={onSubmit}>
      <label htmlFor="task-title">Task Title</label>
      <input
        id="task-title"
        type="text"
        placeholder="What do you need to do?"
        value={title}
        onChange={(event) => onTitleChange(event.target.value)}
        required
      />

      <label htmlFor="task-description">Description</label>
      <textarea
        id="task-description"
        placeholder="Optional details..."
        value={description}
        onChange={(event) => onDescriptionChange(event.target.value)}
        rows="3"
      />

      <div className="date-time-row">
        <div>
          <label htmlFor="task-date">Due Date</label>
          <input
            id="task-date"
            type="date"
            value={dueDate}
            onChange={(event) => onDueDateChange(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="task-time">Due Time</label>
          <input
            id="task-time"
            type="time"
            value={dueTime}
            onChange={(event) => onDueTimeChange(event.target.value)}
          />
        </div>
      </div>

      <button className="primary-btn" type="submit">
        Add Task
      </button>
    </form>
  )
}

export default TaskForm
