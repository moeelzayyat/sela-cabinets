# TOOLS.md - Mango's Environment & Business Tools

## Business Info

- **Company:** SELA Cabinets
- **Website:** https://selacabinets.com
- **Phone:** (313) 246-7903
- **Booking page:** https://selacabinets.com/book
- **Estimate page:** https://selacabinets.com/estimate
- **Gallery:** https://selacabinets.com/gallery

## Service Area

Detroit metro — 15+ cities including:
Dearborn, Troy, Sterling Heights, Ann Arbor, Royal Oak, Farmington Hills, Livonia, Canton, Novi, Southfield, West Bloomfield, Rochester Hills, Plymouth, Westland, Redford Township

## Pricing Reference

- 10x10 kitchen starting at $3,999 installed
- Free in-home measurement with order
- Typical install time: 1-3 days
- Savings: up to 66% vs big-box stores (Home Depot, Lowes)

_(Update with specific cabinet lines, pricing tiers, and options as they're shared)_

## Key Links to Share with Clients

- Book free consultation: https://selacabinets.com/book
- Get a quick estimate: https://selacabinets.com/estimate
- View our gallery: https://selacabinets.com/gallery
- Call/text us: (313) 246-7903

## Server & Infrastructure

- **Server IP (Mango/DB):** 15.204.156.235
- **Server IP (Coolify/Deploy):** 15.204.156.223
- **SSH User:** way
- **SSH Password (fallback):** SamasemTanash12$$..
- **Bot platform:** OpenClaw (Docker container: openclaw-openclaw-gateway-1)
- **Gateway port:** 18789
- **Bridge port:** 18790
- **AI Model:** openai/gpt-5-mini (primary)

### SSH Access (from this container)

SSH key auth is configured. No password needed:
```bash
# Mango's server (database, OpenClaw)
ssh way@15.204.156.235 "YOUR COMMAND HERE"

# Coolify server (deployments, app containers)
ssh way@15.204.156.223 "YOUR COMMAND HERE"

# Examples:
ssh way@15.204.156.235 "docker ps"
ssh way@15.204.156.235 "docker logs --tail 50 sela-postgres"
ssh way@15.204.156.223 "docker logs --tail 50 cgog4w8wgsk0w4gogc4ocsco-*"
```

If key auth ever stops working (e.g. container rebuilt), use sshpass fallback:
```bash
sshpass -p 'SamasemTanash12$$..' ssh -o StrictHostKeyChecking=no way@15.204.156.235 "COMMAND"
```

## Database (Production)

- **Container:** sela-postgres (postgres:16-alpine)
- **Host:** 15.204.156.235
- **Port:** 5433
- **Database:** sela_cabinets
- **User:** sela_app
- **Password:** sela_secure_2024
- **SSL:** Enabled (self-signed cert)
- **Docker compose:** /home/way/sela-postgres/docker-compose.yml
- **Data directory:** /home/way/sela-postgres/data/
- **Connection string:** `postgresql://sela_app:sela_secure_2024@15.204.156.235:5433/sela_cabinets`
- **Tables:** leads, customers, estimates, estimate_requests, appointments, jobs, chat_logs, chatbot_config, chat_messages, chat_sessions

### Maintenance Commands
- Check status: `docker ps --filter name=sela-postgres`
- View logs: `docker logs --tail 50 sela-postgres`
- Restart: `docker restart sela-postgres`
- Connect: `docker exec -it sela-postgres psql -U sela_app -d sela_cabinets`

## Coolify (Deployment Platform)

- **Server:** 15.204.156.223:8000
- **Login:** admin@selatrade.com
- **SELA Cabinets app UUID:** cgog4w8wgsk0w4gogc4ocsco
- **Git repo:** moeelzayyat/sela-cabinets (branch: main)
- **Build pack:** Nixpacks
- **Domains:** selacabinets.com, www.selacabinets.com
- **Deploy flow:** Push to `moeelzayyat/sela-cabinets` main branch → trigger redeploy in Coolify UI → build takes ~3 minutes
- **Note:** Real-time service is often disconnected (warning banner) but deploys still work

## Accounts & Integrations

_(Add as connected)_

- **Social media accounts:** _(Instagram, Facebook, Google Business — TBD)_
- **Ad platforms:** _(Google Ads, Meta Ads — TBD)_
- **CRM:** _(TBD — using leads/PIPELINE.md for now)_
- **Bookkeeping:** _(TBD — using financials/TRACKER.md for now)_
- **Email:** _(TBD)_
- **Messaging channels:** _(WhatsApp, Telegram — TBD)_

## Client Response Templates

### New Inquiry Response
> Hi [Name]! Thanks for reaching out to SELA Cabinets. I'd love to help you with your kitchen project. Could you share a few details — what area are you in, and are you looking to update your existing cabinets or doing a full kitchen renovation? We can get you a quick estimate or book a free in-home consultation at your convenience.

### Follow-Up (2 days)
> Hi [Name], just checking in! I wanted to make sure you got the info you needed about your kitchen project. We have appointments available this week if you'd like a free in-home measurement. Let me know how I can help!

### Follow-Up (5 days)
> Hey [Name]! Just wanted to circle back one more time. Our 10x10 kitchen packages start at $3,999 installed, and we'd love to show you some options. No pressure — just here when you're ready. 🥭

---

_Update with specific tools, accounts, and templates as the business grows._
