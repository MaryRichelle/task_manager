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

### 2. Optimistic toggle

`handleToggle` used to await the request before touching state, and `api.js`
uses a random delay between 150 and 550ms, so the checkbox just sat there after
you clicked it. Long enough that you assume it's broken and click again.

Now the flip happens first and the request goes out afterwards. If it fails the
task goes back to how it was and an error appears.

Rolling back was the fiddly part. My first instinct was to snapshot `tasks` and
restore it on failure, but that's wrong here: the fetch effect can replace the
whole array while the request is in flight, and restoring the snapshot would
throw away whatever came back. So the rollback works on a single task by id
inside a functional update, which also does nothing harmful if the task has been
deleted or filtered away in the meantime.

I don't use the object the server sends back. It only ever flips `completed`, so
it always agrees with what's already on screen, and ignoring it avoids an older
response landing after a newer one. It also dodges a rough edge in `api.js`:
`toggleTask` with an id that doesn't exist resolves with `{}`, because
`{...undefined}` is an empty object, and the old code put that straight into the
list as a row with no id or title.

A second click on a task that's still waiting is ignored, tracked with a set of
pending ids. Otherwise two requests race and the server flips twice.

Completing a task while you're on the "active" filter takes the row out of the
list straight away, since it doesn't belong there any more. That needed a
`matchesFilter` helper which repeats the filtering rule from `api.js`.
Duplicating it isn't lovely, but an optimistic update has to work the answer out
locally rather than asking the server. If the request then fails, the row goes
back at the index it came from rather than being appended to the end.

The toggle error and the loading error below are separate pieces of state on
purpose, so they can't fight over the same spot on screen.

### 3. Debounced search

Already handled in Part 1. Bug 3 covers waiting for a pause in typing, and bug 4
covers not letting an older response overwrite a newer one, so there was nothing
left to add here.

### 4. Loading and error states with retry

A failed fetch used to `console.error` and clear the loading flag, which left you
looking at "No tasks found." That's the same screen you get when you genuinely
have no tasks, so there was no way to tell a broken request from an empty list,
and nothing you could do about it either way.

There's a `loadError` now, and the render has three branches instead of a
loading/not-loading ternary: loading, error with a Retry button, then the list.
The old two-way ternary had nowhere to put a third state, which is why a failure
fell through to the empty list in the first place.

Retry is a `reloadKey` counter sitting in the effect's dependency array. Clicking
it bumps the number and the effect runs again. Because `filter` and `query` are
still in that same array, you retry the request you were actually making instead
of a blank one.

The error clears at the start of every fetch, otherwise a failure followed by a
filter change leaves a stale message next to fresh results. The `isCurrent` guard
covers this path too, so a failure from a request you've already moved on from
can't put an error on screen.

Worth flagging: `fetchTasks` in `api.js` never rejects, so this can't be
triggered by using the app. To see it by hand you'd have to make `fetchTasks`
throw temporarily. I left `api.js` alone since it stands in for a real backend.
