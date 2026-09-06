# Frontend (React.js) Skill Test — Starter Codebase

This is the starter project for the React.js frontend skill test.

It's a small **Task Manager** app: users can add tasks, mark them complete, delete
them, filter by status (all/active/completed), and search by title.

The app **runs**, but it has real bugs. Your job (Part 1) is to find and fix them.
Part 2 asks you to extend the app with new features. See the full task description
(shared separately) for details.

## Project structure

```
frontend-react-skill-test/
├── index.html
├── vite.config.js
├── package.json
├── src/
│   ├── main.jsx
│   ├── App.jsx             # top-level state + data fetching — this is where most bugs live
│   ├── api.js               # mock "backend" with simulated network latency
│   └── components/
│       ├── TaskForm.jsx
│       ├── TaskList.jsx
│       ├── TaskItem.jsx
│       ├── FilterBar.jsx
│       └── SearchBox.jsx
└── test/
    └── App.test.jsx          # starter test file (incomplete — extend it)
```

## Prerequisites

- Node.js 18+
- npm or yarn

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm test         # run the test suite (Vitest + React Testing Library)
```
# task_manager
