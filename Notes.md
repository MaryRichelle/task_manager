# Bug Notes

## 1. Task toggle mutates React state

**What was wrong:** `handleToggle` changes `task.completed` directly and then
passes the same `tasks` array to `setTasks`.

**Why it matters:** React may not detect a state change when the array reference
is unchanged, so the checkbox may not update reliably after a toggle.

**Fix:** Create a new array and a new task object with `map` and the spread
operator instead of mutating the existing state.

## 2. Task list uses array indexes as keys

**What was wrong:** `TaskList` uses `key={index}` when rendering task rows.

**Why it matters:** After deleting or reordering a task, React can reuse a row
for a different task. Checkbox state, input focus, or other row state may then
appear to move to the wrong task.

**Fix:** Use the task's stable identifier: `key={task.id}`.
