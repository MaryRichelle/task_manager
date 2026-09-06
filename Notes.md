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

## 3. Search timers are not cancelled

**What was wrong:** `SearchBox` starts a new `setTimeout` for every keystroke but
does not clear the previous timer.

**Why it matters:** Typing quickly triggers multiple searches, including searches
for outdated text. This creates unnecessary requests and can display stale
results.

**Fix:** Return a cleanup function from the effect that calls
`clearTimeout`, so only the latest paused query is submitted.

## 4. Filter and search requests can become stale

**What was wrong:** Each filter or query change could start a new request, but
an older request could finish after the latest request and overwrite the screen
with results for an old filter or query.

**Why it matters:** A user could select one filter and see results belonging to
a different filter, especially when the network responses finish out of order.

**Fix applied:** `App` now uses an `isCurrent` flag inside the fetch effect. The
cleanup function marks the previous effect as inactive, and a response updates
state only when its effect is still current. The cleanup also clears the delay
timer. This correctly prevents stale responses from changing the UI.

`App` now fetches immediately for filter changes, while `SearchBox` owns the
300ms search debounce. This avoids duplicate delays and makes the loading state
change immediately when the filter changes.
