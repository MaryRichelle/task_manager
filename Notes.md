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
state only when its effect is still current. This correctly prevents stale
responses from changing the UI.

`App` now fetches immediately for filter changes, while `SearchBox` owns the
300ms search debounce. This avoids duplicate delays and makes the loading state
change immediately when the filter changes.

---

## Part 2 — Features

### 1. URL-synced filter

The filter only lived in `useState`, so refreshing the page dropped you back to
"all", and sending someone a link never showed them what you were actually
looking at.

I moved it into a `useUrlFilter` hook (`src/useUrlFilter.js`). It returns
`[filter, setFilter]` the same way `useState` does, so `App` only needed one
line changed.

Three things have to happen for this to work properly:

- read `?filter=` on the first render, using a lazy initialiser, so the first
  request already has the right filter. Otherwise the "all" list shows for a
  moment before it corrects itself.
- update the URL when the filter changes
- listen for `popstate`, because Back changes the URL without re-rendering React

The last one is the easy one to miss. Without it you press Back and the address
bar says `?filter=completed` while the screen is still showing everything.

A few decisions I made along the way:

I used the History API instead of React Router. It's one query param, and the
hook came out at about 45 lines, which seemed better than pulling in a router
for that.

`pushState` rather than `replaceState`, so Back steps through the filters you
clicked. There's a check that skips the push when the URL is already correct,
otherwise the first render adds a duplicate entry and you have to press Back
twice to get off the page.

Going back to "all" removes the param instead of writing `?filter=all`, and
anything unknown in the URL falls back to "all", since people can type whatever
they want in the address bar.

`FILTERS` moved into the hook and `FilterBar` imports it now, so the list isn't
written out in two places.

Six tests cover this: loading from the URL, the fallback for a bad value,
writing the param, clearing it again on "all", leaving unrelated params alone,
and Back.
