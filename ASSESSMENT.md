# Backend (Node.js) Skill Test

**Format:** Take-home practical assignment

---

## 👋 Welcome

Thanks for taking this test! It evaluates how you read, debug, and extend a real
Node.js API — the kind of work you'd do day-to-day on our backend.

We care about **correct, safe, predictable server behavior**, not trick questions.

---

## 🩹 Part 1 — Find and Fix the Bugs

The API has **several real issues** hiding in it — spanning async handling, error
handling, concurrency, and input validation. We're not going to point out exactly
where they are; part of the exercise is finding them the way you would in a real
code review or while writing tests.

To guide your investigation, here's what should hold true in a **correct**
implementation — if any of these don't, there's a bug to fix:

- [ ] Creating a task via `POST /tasks` should return the actual created task in the response — not a placeholder that doesn't match what ends up stored.
- [ ] Firing many `POST /tasks` requests at the same time should never result in two tasks getting the same id.
- [ ] Sending malformed input (bad JSON, missing fields) should get a clean, consistent JSON error response — never an unhandled crash or an inconsistent response shape.
- [ ] Updating a task via `PUT /tasks/:id` shouldn't let the caller silently overwrite fields they shouldn't control (like the task's `id`) just by including them in the request body.

> 💡 Tip: A small script (or test) that fires several `POST /tasks` requests concurrently, and another that sends deliberately malformed input, will surface most of these faster than reading top to bottom.

For each bug you find, briefly explain in your `NOTES.md`:
- What was wrong
- Why it was a problem (what could go wrong in production, under real traffic)
- How you fixed it

---

## ✨ Part 2 — Add Features

Once the API is correct, extend it with the following:

1. **Input validation** — reject task creation/update requests with a missing or non-string `title` (or other invalid fields you introduce), returning a clear `400` with a descriptive error body. A schema validator (e.g. Zod, Joi) or hand-rolled checks are both fine.
2. **Pagination** — support `GET /tasks?limit=&offset=` (or cursor-based, your call) so clients can page through large task lists instead of always getting everything back.
3. **Rate limiting** — apply basic rate limiting to the write endpoints (`POST`/`PUT`/`DELETE`), returning `429` once a client exceeds the limit.
4. **Auth middleware** — protect the write endpoints behind a simple API key check (e.g. an `x-api-key` header validated against an env var), returning `401` when it's missing or invalid. `GET /tasks` can stay open.

You don't need to gold-plate every feature — working, well-tested, reasonably clean code for all four is the goal. If you run out of time, implement as many as you can and note what's left in `NOTES.md`.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18+ |
| Framework | Express |
| Testing | Jest + Supertest |

You're welcome to bring in small, well-justified libraries (a validator, a rate-limiter middleware, etc.) — just note your choices in `NOTES.md`. Swapping the in-memory store for a real database is not required, but you're welcome to if you'd rather — just make sure `npm test` still works without external setup.

---

## ✅ Evaluation Criteria

| Criteria | What we're looking for |
|---|---|
| **Correctness** | Bugs are actually fixed, not just papered over |
| **Async & error handling** | Proper `await`/error propagation, no unhandled rejections, consistent error responses |
| **Concurrency awareness** | You reason about what happens when requests overlap, not just the single-request happy path |
| **Testing** | Meaningful tests covering both the fixes and the new features, including at least one concurrency test |
| **Communication** | Clear `NOTES.md` explaining what you found and why you made the choices you did |

---
