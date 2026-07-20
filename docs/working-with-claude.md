# Working with Claude sessions — keeping this repo conflict-free

This guide exists because it already went wrong once: three Claude sessions ran
at different times without committing, pushing, or merging, and the repo ended
up with three diverged branches — `main` still showed the old Drive-based
onboarder while the real blueprint sat unmerged on a side branch, and a Fly.io
launch created a third. The July 2026 consolidation fixed it. These five rules
keep it fixed.

## The five rules

### 1. One task = one session = one branch
Give each Claude session a single job ("write this week's social posts", "build
the pricing module"). Don't start two sessions on the same topic at the same
time. If two sessions must run in parallel, they must work on **different
branches** — ask each session which branch it is on if unsure.

### 2. End every session with: "commit and push everything now"
A session's files live in a temporary computer that is thrown away afterwards.
Anything not committed **and pushed** is gone. Before you close a session (or
walk away for a long time), send exactly this message:

> commit and push everything now

Claude in this repo is also instructed (in `CLAUDE.md`) to commit and push at
natural stopping points without being asked — but the end-of-session message is
your safety net.

### 3. Start every session with: "sync with the latest main first"
A new session clones the repo as it is *at that moment* — but if your last
session's work hasn't been merged yet, the new session may not see it. Starting
with:

> sync with the latest main first, then …

makes Claude fetch all branches and check nothing newer exists before building
on stale files. This single habit is what prevents the "overlapped work" problem.

### 4. `main` is the single source of truth — merge good work promptly
When a session's work is done and you're happy with it:

1. Ask Claude: **"open a pull request to main"**.
2. Claude replies with a link like `github.com/…/pull/12`. Open it.
3. Read the summary; the "Files changed" tab shows every edit.
4. Press the green **"Merge pull request"** button (bottom of the
   "Conversation" tab), then **"Confirm merge"**.
5. Press **"Delete branch"** when GitHub offers it — the work is now safely in
   `main`; the branch has served its purpose.

If you never merge, every future session starts from an old `main` and the
branches drift apart again.

### 5. Keep the branch list short
Look at `github.com/<owner>/<repo>/branches` occasionally. Healthy state: `main`
plus at most one or two branches with work in progress. Anything older that's
merged or abandoned — delete it (there's a red bin icon next to each branch).
A long branch list is where overlapped work hides.

## What went wrong last time (so it makes sense)

- **June 2:** repo created with the single-file onboarder on `main`.
- **June 10:** a Fly.io launch pushed deploy files to a branch
  (`flyio-new-files`) that was never merged.
- **June 23:** a Claude session designed the whole store-management system on
  another branch (`claude/shopify-business-model-repo-p2rco8`) — also never
  merged, so `main` still looked like the old onboarder.
- **July 20:** a new session started from `main`, couldn't see any of that, and
  nearly planned duplicate work from scratch.

Every step was fine on its own; the missing piece was **rule 4** — merging each
finished branch into `main` before starting the next thing.

## Cheat sheet

| Moment | Say to Claude |
|--------|---------------|
| Starting any session | "sync with the latest main first, then <task>" |
| Finishing for the day | "commit and push everything now" |
| Work is approved | "open a pull request to main" |
| After merging on GitHub | (press "Delete branch" when offered) |
| Unsure what state things are in | "show me all branches and what's unmerged" |
