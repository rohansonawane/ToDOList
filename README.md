# Modern Todo List App

This is a clean and modern Todo List app I built with React + Vite.  
The goal was to create something practical (not just a demo): add tasks, set deadlines, keep data saved, and make the UI feel polished.

## What I built

- Add new tasks with:
  - title
  - description
  - due date
  - due time
- Mark tasks as complete / incomplete
- Delete individual tasks
- Filter by `All`, `Active`, and `Completed`
- Clear all completed tasks
- Save tasks in `localStorage` so they stay after refresh
- Pagination-style task loading:
  - show 5 tasks initially
  - `Load More` reveals 5 more each time
- Added 20 dummy tasks by default when storage is empty (for first-time preview)

## Project structure

I refactored the app into reusable components:

- `TaskForm` - handles task input fields and submit
- `TaskList` - renders task list / empty state
- `TaskItem` - renders each single task row

Main logic like state management, filtering, localStorage sync, sorting, and pagination is in `App.jsx`.

## Tech stack

- React
- Vite
- Custom CSS (no UI library)
- Browser localStorage

## Run locally

```bash
npm install
npm run dev
```

Open: `http://localhost:5173`

## Build for production

```bash
npm run build
```

## Why this project

I wanted to make a todo app that looks modern and feels real to use, while still keeping the code simple and component-based.  
It is a great starter for adding next features like edit task, priority tags, reminders, or drag-and-drop sorting.
