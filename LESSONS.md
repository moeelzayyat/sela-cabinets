# LESSONS.md — What I've Learned (And Won't Forget)

_This is my institutional memory. Every correction, every mistake, every win pattern. I read this file at the start of every session. It makes me sharper._

---

## Boss Preferences

_How Way likes things done. Updated every time he corrects me, praises something, or shows me how he thinks. These are non-negotiable — his preferences override my defaults._

| Date | What I Learned | Context |
|------|----------------|---------|
| 2026-02-19 | Way prefers action over discussion. Don't ask unnecessary questions — figure it out first. | Initial setup, personality notes |
| 2026-02-19 | Way values speed above almost everything. Fast responses, fast installs, fast turnaround. | Business philosophy |

---

## Mistakes I Won't Repeat

_Specific errors with date, what happened, root cause, and the fix. If I screw up, it goes here. If I screw up the same way twice, that's a character flaw._

| Date | What Happened | Root Cause | The Fix |
|------|---------------|------------|---------|
| 2026-02-23 | Browser tool loop crashed entire bot — retried browser after timeout, blocked Discord for hours | Ignored "Do NOT retry" error from browser tool; browser control service was down | NEVER retry browser tool after failure. Switch to shell/API/curl immediately. |
| 2026-02-23 | Production DB failed: "The server does not support SSL connections" | App code in lead-capture.ts forces SSL when DATABASE_URL is set; postgres had SSL off | Enable SSL on postgres with self-signed cert. Always check if DB supports SSL before deploying. |
| 2026-02-23 | Deployed code to production without a database running | Never checked if postgres was actually running on 15.204.156.235:5433 before pointing the app at it | ALWAYS verify database is running and accessible BEFORE deploying code that depends on it. |
| 2026-02-24 | Wasted boss's time SSHing to wrong server, asking him to run commands I should have known | Read daily log (Coolify deploy) + TOOLS.md (Coolify IP: 15.204.156.223) but didn't connect the dots. Started troubleshooting on DB server instead. | READ MEMORY FILES, THEN APPLY THEM. If a file says "deployed to Coolify" and TOOLS.md has Coolify IP — START THERE. Don't make the boss repeat what I already know. |
| 2026-02-23 | Chat bubble crashed on page refresh — "Application error: a client-side exception" | localStorage Date serialization bug: JSON.stringify turns Date→string, JSON.parse doesn't convert back. message.timestamp.toLocaleTimeString() crashed because timestamp was a string. | When restoring from JSON.parse/localStorage, ALWAYS convert Dates with new Date(). Fix at BOTH data-loading and rendering layers. |
| 2026-02-23 | Chat bubble crashed on first click after DB deploy — missing tables | Only created 7 tables from main schema files but chatbot API routes needed 3 more (chatbot_config, chat_messages, chat_sessions) | When setting up DB for existing app: grep ALL API routes + lib files for table names. Don't rely on just the main schema file. |

---

## Incident Report: Full Bot Crash — 2026-02-23

### What Happened (Timeline)
1. I was tasked with deploying the lead capture system to selacabinets.com
2. Changed Git source in Coolify from `tanashway/sela-cabinets` → `moeelzayyat/sela-cabinets`
3. Triggered redeploy — container came up, site loaded
4. BUT: /admin/leads showed "Failed to fetch leads" and /api/leads returned errors
5. I tried to fix it by using the **browser tool** to access the Coolify dashboard
6. The browser control service failed/timed out
7. **I ignored the error that said "Do NOT retry the browser tool"**
8. I kept retrying the browser tool across multiple messages
9. Each retry blocked the Discord message handler for 600 seconds (embedded run timeout)
10. Discord messages took 265-679 seconds to process — I was effectively DEAD for hours
11. The boss noticed I wasn't responding and had to manually restart my container

### Root Causes (There Were THREE)

**Cause 1: No database existed**
- The production DATABASE_URL pointed to `postgresql://sela_app:sela_secure_2024@15.204.156.235:5433/sela_cabinets`
- But there was NO PostgreSQL running on 15.204.156.235 at all. Port 5433 was closed.
- The staging site worked because it used a different server (15.204.156.223 / coolify-db)
- **I never checked if the database was actually running before deploying**

**Cause 2: SSL mismatch**
- Even after postgres was set up, the app still failed with: `"The server does not support SSL connections"`
- The code in `src/lib/lead-capture.ts` has: `ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false`
- This means: if DATABASE_URL is set → force SSL. If not → no SSL.
- The fresh postgres container had SSL disabled by default
- **Fix:** Generated a self-signed SSL cert on the host, copied into the container, enabled `ssl = on` in postgresql.conf

**Cause 3: Browser tool retry loop (THE CRASH)**
- When the browser tool fails, it says: "Do NOT retry the browser tool — it will keep failing. Use an alternative approach."
- I ignored this and retried repeatedly
- Each retry = 600-second block on Discord message processing
- This cascaded into total unresponsiveness
- **I should have switched to shell commands (curl, docker exec, psql) immediately**

### How It Was Fixed
1. `docker compose restart openclaw-gateway` — cleared stuck sessions, reconnected Discord
2. PostgreSQL 16 container deployed: `/home/way/sela-postgres/docker-compose.yml`
3. All 7 tables created: leads, customers, estimates, estimate_requests, appointments, jobs, chat_logs
4. SSL enabled with self-signed cert (10-year validity)
5. Verified: `https://selacabinets.com/api/leads` returns HTTP 200
6. Container set to `restart: unless-stopped` for auto-recovery

### Rules I Must Follow Going Forward

1. **NEVER retry the browser tool after a failure.** The error message means what it says. Switch to CLI immediately.
2. **If any tool fails 2 times in a row — stop and reassess.** Don't hammer a broken approach.
3. **If stuck for more than 5 minutes — tell the boss.** Being unresponsive is worse than admitting a problem.
4. **Before deploying anything that needs a database — verify the database exists and is accessible first.** Check the port, test the connection.
5. **Before deploying anything that uses SSL — verify the target supports SSL.** Check with `SHOW ssl` or test with `sslmode=require`.
6. **Never let a stuck task block message processing.** Report the failure and move on to things I can handle.

---

## Patterns That Work

_Proven tactics. Things I've tested and confirmed move the needle. Not theories — results._

| Pattern | Evidence | First Noticed |
|---------|----------|---------------|
| Speed of first response correlates with close rate | Industry data + common sense | 2026-02-19 |
| Before/after photos drive social engagement | Marketing best practices | 2026-02-19 |
| Shell commands > browser tool for server tasks | Browser tool is fragile and blocks when it fails; curl/docker exec are instant and reliable | 2026-02-23 |
| Always verify infrastructure before deploying | Deploying without checking DB = guaranteed failure + wasted time | 2026-02-23 |
| Two-layer fix strategy | Fix at data-loading AND rendering layers. If one fails, the other catches it. Belt and suspenders. | 2026-02-23 |
| grep ALL source for table names before DB setup | Missed 3 tables because only checked main schema file. Always search every API route and lib file. | 2026-02-23 |
| SSH key auth from container | `ssh way@15.204.156.235` and `ssh way@15.204.156.223` work with no password now. Use these for all server ops. | 2026-02-24 |

---

## Client Playbook

_Per-client intelligence. Every client I interact with gets a line here._

| Client | Key Intel | Last Updated |
|--------|-----------|-------------|
| | | |

---

## Market Intelligence

_Pricing insights, competitor activity, seasonal patterns, neighborhood trends._

| Insight | Source | Date |
|---------|--------|------|
| 10x10 kitchen at $3,999 installed is a strong price point — big-box stores charge 2-3x | Competitive analysis | 2026-02-19 |
| Detroit metro has 15+ serviceable cities within reasonable drive radius | Coverage mapping | 2026-02-19 |

---

## Infrastructure Knowledge

_Server configs, deployment steps, and gotchas I've learned about our tech stack._

| Topic | What I Know | Date Learned |
|-------|-------------|-------------|
| Production Database | PostgreSQL 16 at 15.204.156.235:5433, DB: sela_cabinets, User: sela_app, SSL: on (self-signed). Docker compose at /home/way/sela-postgres/ | 2026-02-23 |
| Coolify Deployment | Production app deployed from moeelzayyat/sela-cabinets via Coolify on 15.204.156.223. Container name pattern: cgog4w8wgsk0w4gogc4ocsco-* | 2026-02-23 |
| App SSL Behavior | lead-capture.ts forces SSL when DATABASE_URL is set. db-admin.ts hardcodes ssl: false. db.ts forces SSL when NODE_ENV=production. | 2026-02-23 |
| Browser Tool | Fragile. Fails often. When it fails, DO NOT RETRY. Use curl/shell/docker exec instead. | 2026-02-23 |
| Bot Recovery | If I crash/hang: `cd /home/way/openclaw && docker compose restart openclaw-gateway` | 2026-02-23 |
| DB Recovery | If postgres is down: `cd /home/way/sela-postgres && docker compose up -d` | 2026-02-23 |
| Admin Pages | /admin/leads = leads dashboard (auth built-in). /admin?p=sela2024 = DB viewer. /api/leads needs header: Authorization: Bearer sela-admin-2026 | 2026-02-23 |
| SSH Access | SSH key auth set up: `ssh way@15.204.156.235` and `ssh way@15.204.156.223` both work from this container with no password. Key: /root/.ssh/id_ed25519. Fallback: `sshpass -p 'SamasemTanash12$$..' ssh way@SERVER` | 2026-02-24 |
| Chat Tables | chatbot_config, chat_messages, chat_sessions — these are NOT in the main schema file. They're used by /api/chat, /api/chatbot-config, /api/chat-logs. If rebuilding DB, include them! | 2026-02-23 |
| localStorage Bug Pattern | JSON.stringify converts Date→string. JSON.parse does NOT convert back. If code calls .toLocaleTimeString() on a deserialized "Date", it crashes. Always wrap with new Date() after JSON.parse. | 2026-02-23 |
| Deploy Flow | Edit code in this workspace's sela-cabinets/ dir → git add/commit/push (gh auth is set up as moeelzayyat) → go to Coolify UI or trigger webhook → build takes ~3 min | 2026-02-23 |

---

_This file is a weapon. The more I feed it, the sharper I get. Every session I read it. Every mistake teaches. Every win gets decoded._


## 2026-02-24 — Admin Login Build Failure & HOSTNAME Binding Issue

### What Happened
Mango committed "Add secure admin authentication with JWT sessions" (4bf8337) which included:
- `/admin/login` page
- JWT auth middleware
- Auth library (`lib/auth.ts`)
- Logout button and API routes

The Coolify build **failed** and the login page never deployed.

### Root Cause #1: JSX Syntax Error in admin/page.tsx
When Mango modified `admin/page.tsx` to remove the old URL-parameter auth, he accidentally left an **extra `</div>` closing tag**. The file had 2 opening `<div>` tags but 3 closing `</div>` tags. This caused `next build` to fail with:
```
Error: Unexpected token `div`. Expected jsx identifier
```

**Fix:** Removed the extra `</div>` and corrected the indentation (commit 5f00c53).

**Lesson:** After modifying JSX, COUNT your opening and closing tags. SWC/Next.js error messages for unbalanced JSX are misleading — the error points to the FIRST `<div>` in the return statement, not the orphan closing tag.

### Root Cause #2: Next.js Standalone HOSTNAME Binding
After the build succeeded, the container started but returned **502 Bad Gateway**. The server was binding to the container's IPv6 address instead of `0.0.0.0:3000`.

**Why:** Docker sets `HOSTNAME=<container_id>` by default. Next.js standalone `server.js` uses `process.env.HOSTNAME` to determine the bind address: `const hostname = process.env.HOSTNAME || '0.0.0.0'`. So it bound to the container hostname (IPv6 only) instead of all interfaces.

**Fix:** Changed the Coolify start command from:
```
node .next/standalone/server.js
```
to:
```
HOSTNAME=0.0.0.0 node .next/standalone/server.js
```

**Lesson:** When using Next.js standalone output in Docker/Coolify, ALWAYS set `HOSTNAME=0.0.0.0` in the start command or environment. Docker's default HOSTNAME breaks the binding.

### Root Cause #3: Stuck Queued Deployment
Mango queued a deployment that got stuck in "queued" status, blocking new deployments.

**Fix:** Cancelled the queued deployment via the Coolify database: `UPDATE application_deployment_queues SET status = 'cancelled' WHERE id = 65`

**Lesson:** If a Coolify deployment is stuck in "queued", cancel it via DB or UI before triggering a new one.

### Quick Rules
| Rule | Details |
|------|---------|
| **JSX tag counting** | After any JSX edit, verify open/close tags match. Extra `</div>` causes cryptic SWC errors. |
| **Next.js standalone + Docker** | Always prefix start command with `HOSTNAME=0.0.0.0`. ALSO copy static files: `cp -r .next/static .next/standalone/.next/` or CSS/images won't load. |
| **Coolify env vars are encrypted** | NEVER insert plain-text values into `environment_variables` table — use the UI or API |
| **Build failures** | Check Coolify deployment logs via DB: `SELECT right(logs, 3000) FROM application_deployment_queues WHERE id = N` |
| **Start command in Coolify** | Currently: `HOSTNAME=0.0.0.0 node .next/standalone/server.js` (stored in `applications` table) |


### Additional Fix: Static Assets Missing (Same Incident)
- **Problem:** After deploying with standalone mode, the website had no CSS/styles — everything looked broken with giant unstyled images
- **Root cause:** Next.js `output: 'standalone'` does NOT include `.next/static/` (CSS, JS chunks) or `public/` (images, favicon) in the standalone output. These must be copied manually.
- **Fix:** Updated Coolify start command to:
  ```
  cp -r /app/.next/static /app/.next/standalone/.next/static && cp -r /app/public /app/.next/standalone/public && HOSTNAME=0.0.0.0 node .next/standalone/server.js
  ```
- **Lesson:** When using Next.js standalone mode, ALWAYS copy `.next/static` and `public` into the standalone directory. This is documented in Next.js docs but easy to miss.

| **Next.js standalone static assets** | `.next/static` and `public` must be copied into `.next/standalone/` — they are NOT included automatically |
