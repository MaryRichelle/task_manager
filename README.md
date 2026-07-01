# Backend (Node.js) Skill Test — Starter Codebase

This is the starter project for the Node.js backend skill test.

It's a small **Tasks API** (Express, in-memory store): clients can list, create,
update, and delete tasks.

The API **runs**, but it has real bugs. Your job (Part 1) is to find and fix them.
Part 2 asks you to extend it with new features. See the full task description
(shared separately) for details.

## Project structure

```
backend-nodejs-skill-test/
├── src/
│   ├── app.js              # Express app setup
│   ├── server.js            # entry point (starts the HTTP server)
│   ├── store.js             # in-memory "database" — race condition lives here
│   └── routes/
│       └── tasks.js          # this is where most of the bugs live
└── test/
    └── tasks.test.js         # starter test file (incomplete — extend it)
```

## Prerequisites

- Node.js 18+
- npm or yarn

## Getting started

```bash
npm install
npm run dev      # start the API on http://localhost:3000
npm test         # run the test suite (Jest + Supertest)
```

## API overview

| Method | Path | Description |
|---|---|---|
| GET | `/tasks` | List all tasks |
| POST | `/tasks` | Create a task (`{ "title": "..." }`) |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |
