# Skill Test — Instructions

Welcome! This repository hosts our take-home skill tests for engineering roles.
It's organized as multiple branches so each track (stack) has its own task
description and starter codebase, while this branch (`master`) just holds these
instructions.

## 📂 Repository structure

| Branch | Contents |
|---|---|
| `master` | This file — general instructions, applies to every track |
| `fullstack` | Fullstack skill test: task description + starter React/Node project |
| `frontend` | Frontend (React) skill test: task description + starter React project |
| `backend` | Backend (Node.js) skill test: task description + starter Node/Express project |

You only need the branch matching the track you were assigned. If you weren't told
which track, check with whoever sent you this test before starting.

---

## 🚀 Setup

1. **Extract the archive you were sent** (`skill-test.tar.gz`). It's a git
   repository with all four branches already in it — this isn't hosted on GitHub/GitLab,
   so there's no URL to clone from:
   ```bash
   tar -xzf skill-test.tar.gz
   cd skill-test
   git branch -a   # confirm master, fullstack, frontend, and backend are all present
   ```
2. **Create your own private repository** on GitHub (or GitLab/Bitbucket — wherever
   you prefer), separate from ours. This is where you'll do your work and submit
   your solution from — not a fork of, or a PR into, our repo.
3. **Point this local repo at your new private repo and push all branches**:
   ```bash
   git remote add origin <your-new-private-repo-url>
   git push -u origin master
   git push -u origin fullstack
   git push -u origin frontend
   git push -u origin backend
   ```
4. **Add your reviewer as a collaborator** on your new private repo, so they
   can review your branch and pull request once you're done.
5. Checkout the branch for your track and read its task description before touching
   any code:
   ```bash
   git checkout frontend   # or: git checkout backend / git checkout fullstack
   ```

---

## 🌿 Branch naming for your submission

Create your working branch **off your track's branch**, named:

```
<yourname><Track>
```

Examples:
- Frontend track, name John → `johnFrontend`
- Backend track, name Maria → `mariaBackend`
- Fullstack track, name Alex → `alexFullstack`

```bash
git checkout frontend
git checkout -b johnFrontend
```

Do all your work on this branch: fix the bugs (Part 1), build the features (Part 2),
add your tests, and include a `NOTES.md` as described in the track's task doc.

---

## 📬 How to submit

Open a **pull request within your own private repository**, from your personal
branch into the track branch it came from:

```
johnFrontend   →  frontend
mariaBackend   →  backend
alexFullstack  →  fullstack
```

Once opened, make sure your reviewer (added as a collaborator in Setup step 4)
has visibility on the PR. Do **not** open a PR against the original repository —
your submission lives entirely in your own private repo; we review it there.

**Final structure of your private repo should look like:**

```
your-private-repo/
├── master                 (unchanged — instructions only)
├── fullstack             (unchanged — original task branch)
├── frontend               (unchanged — original task branch)
├── backend                 (unchanged — original task branch)
└── johnFrontend            (your work, PR'd into frontend)   ← matching whichever track you were assigned
```

You'll only have one of the last three branches, matching your track.

---

## ✅ Before you open the PR, double check

- [ ] Your branch is named `<yourname><Track>` and was branched off the correct track branch
- [ ] `node_modules` / `dist` / `build` / `.cache` are **not** committed (see each track's `.gitignore` or add one)
- [ ] `NOTES.md` is included at the root of your branch, covering Part 1 bug write-ups and Part 2 decisions
- [ ] Your tests actually run (`npm test` in each project folder — both `client/` and `server/` if you're on the fullstack track) and pass
- [ ] The PR description briefly summarizes what you did

---