# Deploying the management console

The console is a standard Next.js app. It builds and runs with **no environment
variables** (seeded/heuristic data), so you can get a clickable live URL fast.

## ⚠️ Read first — there is no login yet

The console has **no authentication** (the `ADMIN_ALLOWLIST` gate is planned, not
built). A public deploy is therefore **world-readable and world-clickable**.

- **For a look-and-click demo:** deploy with **no live tokens set**. Then the
  worst anyone can do is click around seeded data — no live store writes happen.
- **Do NOT** set `SHOPIFY_ADMIN_ACCESS_TOKEN`, `TELEGRAM_BOT_TOKEN`, or
  `ANTHROPIC_API_KEY` on a public, unauthenticated deploy — with those set, a
  stranger hitting `/products` could publish to your live store or trigger
  dispatches. Add auth before any tokened deploy.

## Option A — Vercel (fastest, zero CLI)

1. Go to vercel.com → **Add New… → Project**.
2. **Import** the `ukstylishclub-management` GitHub repo.
3. Framework preset auto-detects **Next.js**. Leave everything default.
4. **Deploy.** You get a `https://<name>.vercel.app` URL in ~2 minutes.

Caveat: Vercel runs serverless functions with an **ephemeral, per-request
filesystem**, so the interim JSON store and in-memory state don't persist —
seeded data renders and you can click through, but an Approve/Broadcast may not
"stick" between requests. Fine for reviewing; for a fully interactive demo use
Option B.

## Option B — Container host (persistent, fully interactive) — recommended

Runs the repo's `Dockerfile` as one long-lived instance, so the in-memory + JSON
store behaves correctly while it's up. Any of Render / Railway / Fly works.

**Render (example):**
1. render.com → **New → Web Service** → connect the GitHub repo.
2. It detects the **Dockerfile**. Instance type: Free is fine.
3. **Create Web Service** → you get a `https://<name>.onrender.com` URL.

**Plain Docker (any VPS):**
```bash
docker build -t uksc .
docker run -p 3000:3000 uksc      # http://localhost:3000
```

## Environment variables (all optional)

| Var | Enables |
|-----|---------|
| `TELEGRAM_BOT_TOKEN` (+ `TELEGRAM_WEBHOOK_SECRET`, `TELEGRAM_CATALOG_CHANNEL_ID`) | Live intake, catalog broadcast, pickup dispatch |
| `ANTHROPIC_API_KEY` | Claude classification (else keyword heuristic) |
| `SHOPIFY_ADMIN_ACCESS_TOKEN` (+ `SHOPIFY_STORE_DOMAIN`) | Real product publishing |
| `DATABASE_URL` | Not needed yet — storage is the interim JSON store until the Prisma swap |

See `.env.example` for the full list. **Heed the security note above before
setting any of these on a public deploy.**
