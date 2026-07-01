# Frontend (React.js) Skill Test

**Format:** Take-home practical assignment

---

## 👋 Welcome

Thanks for taking this test! It evaluates how you read, debug, and extend a real
React app — the kind of work you'd do day-to-day on our frontend.

We care about **correct, predictable UI behavior**, not trick questions.

---

## 🩹 Part 1 — Find and Fix the Bugs

The app has **several real issues** hiding in it — spanning state updates, list
rendering, and async data handling. We're not going to point out exactly where
they are; part of the exercise is finding them the way you would in a real code
review or while using the app yourself.

To guide your investigation, here's what should hold true in a **correct**
implementation — if any of these don't, there's a bug to fix:

- [ ] Toggling a task's checkbox should reliably update the UI every time — not just "usually."
- [ ] Deleting or reordering tasks shouldn't cause other tasks' checkboxes, input focus, or state to jump to the wrong row.
- [ ] Typing quickly in the search box should eventually settle on searching for what you actually typed — not fire a burst of stale, overlapping searches.
- [ ] Rapidly switching filters or typing a fast-changing search query should never leave the screen showing results for a filter/query you're no longer on.

> 💡 Tip: Try clicking quickly through filters while the list is still loading, and try typing fast in the search box — race conditions and debounce bugs are much easier to see in motion than by reading code top to bottom.

For each bug you find, briefly explain in your `NOTES.md`:
- What was wrong
- Why it was a problem (what a user would actually experience)
- How you fixed it

---

## ✨ Part 2 — Add Features

Once the app is correct, extend it with the following:

1. **URL-synced filter** — the current filter (`all`/`active`/`completed`) should be reflected in the URL (e.g. `?filter=active`), so refreshing the page or sharing the link preserves it.
2. **Optimistic toggle** — checking/unchecking a task should update the UI immediately, without waiting on the network round-trip; if the request fails, roll the UI back and show an error.
3. **Proper debounced search** — search should wait for the user to pause typing before firing, and never let an in-flight request overwrite a newer one.
4. **Loading & error states with retry** — the initial task list fetch should show a clear loading state, and if it fails, show an error with a retry button instead of an empty/broken screen.

You don't need to gold-plate every feature — working, well-tested, reasonably clean code for all four is the goal. If you run out of time, implement as many as you can and note what's left in `NOTES.md`.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| UI | React 18 (functional components + hooks) |
| Build tool | Vite |
| Testing | Vitest + React Testing Library |

You're welcome to bring in small, well-justified libraries (e.g. a debounce helper) if they genuinely simplify things — just note your choice in `NOTES.md`. Please don't rewrite the app in a different framework or add a heavy state-management library for this exercise.

---

## ✅ Evaluation Criteria

| Criteria | What we're looking for |
|---|---|
| **Correctness** | Bugs are actually fixed, not just papered over |
| **React fundamentals** | Correct use of state, keys, effects, and cleanup |
| **Async handling** | Race conditions and stale data are handled deliberately, not by luck |
| **Testing** | Meaningful tests covering both the fixes and the new features |
| **Communication** | Clear `NOTES.md` explaining what you found and why you made the choices you did |

---
