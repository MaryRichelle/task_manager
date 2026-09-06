# Bug Notes

## 1. Task toggle mutates React state

**What was wrong:** `handleToggle` changes `task.completed` directly and then
passes the same `tasks` array to `setTasks`.

**Why it matters:** React may not detect a state change when the array reference
is unchanged, so the checkbox may not update reliably after a toggle.

**Fix:** Create a new array and a new task object with `map` and the spread
operator instead of mutating the existing state.
