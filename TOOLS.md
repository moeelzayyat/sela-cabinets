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

- **Server IP:** 15.204.156.235
- **SSH User:** way
- **Bot platform:** OpenClaw (Docker container: openclaw-openclaw-gateway-1)
- **Gateway port:** 18789
- **Bridge port:** 18790
- **AI Model:** openai/gpt-5-mini (primary)

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

## GitHub Integration

- **Skills installed:** github (gh CLI), gh-issues (auto-fix issues with sub-agents)
- **CLI:** gh v2.87.0
- **Auth:** Needs GitHub token configured (see `gh auth login`)
- **Capabilities:**
  - Create/manage issues and PRs
  - Check CI/workflow status
  - Code review operations
  - Auto-fix issues with parallel sub-agents
  - Monitor PR reviews and address comments


---

## Browser Tools

Mango has full browser automation capabilities via headless Chromium:

- **Navigate**: Visit any URL, load pages, follow links
- **Screenshot**: Capture screenshots of any webpage
- **Snapshot**: Get the accessibility tree/DOM structure for AI analysis
- **Click/Type/Fill**: Interact with page elements by reference
- **Tabs**: Open, close, switch between browser tabs
- **Wait**: Wait for text, elements, or page load
- **Console/Network**: Monitor page console messages and network requests

### Usage

The browser uses the "openclaw" profile with headless Chromium. It auto-starts with the gateway container.

### IMPORTANT: Displaying Images from Screenshots

When the browser tool takes a screenshot, it saves the image and returns a path like:
`MEDIA:/home/node/.openclaw/media/browser/abc123.png`

Screenshots are automatically served via the canvas at:
`/__openclaw__/canvas/<filename>`

To display the image to the user, extract the **filename** from the MEDIA: path and use a markdown image with the canvas URL:

**Correct format:**
```
Here's the screenshot of Google.com:

![Screenshot](/__openclaw__/canvas/abc123.png)

Let me know if you need anything else!
```

**WRONG formats (cause broken images):**
```
![Screenshot](MEDIA:/home/node/.openclaw/media/browser/abc123.png)
MEDIA:/home/node/.openclaw/media/browser/abc123.png
![Screenshot](/home/node/.openclaw/media/browser/abc123.png)
```

**Rule:** Always convert the MEDIA: path to `/__openclaw__/canvas/<filename>` before displaying.

### Browser Action Reference

**Top-level actions** (use as `action` parameter):
- `navigate` — Go to a URL (`targetUrl` param)
- `snapshot` — Get page accessibility tree with element refs (use `interactive: true` for only interactive elements)
- `screenshot` — Take a screenshot
- `tabs` — List open browser tabs
- `act` — Perform an interaction (click, type, fill, etc.) via the `request` param

**Act kinds** (use as `request.kind`):
- `click` — Click an element (`ref` from snapshot, optional `doubleClick`, `button`, `modifiers`)
- `type` — Type text into a field (`ref`, `text`) — **USE THIS FOR LOGIN FORMS AND INDIVIDUAL INPUTS**
- `fill` — Fill multiple form fields at once (`fields: [{ref, type, value}, ...]`) — for batch form filling only
- `press` — Press a keyboard key (`key`, e.g. "Enter", "Tab", "Escape")
- `hover` — Hover over an element (`ref`)
- `select` — Select dropdown option (`ref`, `values: ["option"]`)
- `wait` — Wait for text to appear (`text`) or disappear (`textGone`) or fixed time (`timeMs`)
- `drag` — Drag from one element to another (`startRef`, `endRef`)
- `evaluate` — Run JavaScript on the page (`fn`)
- `resize` — Resize viewport (`width`, `height`)

### How to Automate Login / Forms (IMPORTANT)

Follow this exact pattern for filling forms and logging in:

**Step 1: Navigate to the page**
```json
{ "action": "navigate", "targetUrl": "https://example.com/login" }
```
Save the `targetId` from the response for ALL subsequent calls.

**Step 2: Take a snapshot to get element refs**
```json
{ "action": "snapshot", "targetId": "<targetId from step 1>", "interactive": true }
```
This returns elements like:
- `ref: "e3"` — Email input
- `ref: "e4"` — Password input  
- `ref: "e5"` — Login button

**Step 3: Clear and type the email — MUST select-all first since `type` appends!**
```json
{ "action": "act", "request": { "kind": "click", "ref": "e3", "targetId": "<targetId>" } }
```
```json
{ "action": "act", "request": { "kind": "press", "key": "Control+a", "targetId": "<targetId>" } }
```
```json
{ "action": "act", "request": { "kind": "type", "ref": "e3", "text": "user@example.com", "targetId": "<targetId>" } }
```

**Step 4: Clear and type the password — same pattern**
```json
{ "action": "act", "request": { "kind": "click", "ref": "e4", "targetId": "<targetId>" } }
```
```json
{ "action": "act", "request": { "kind": "press", "key": "Control+a", "targetId": "<targetId>" } }
```
```json
{ "action": "act", "request": { "kind": "type", "ref": "e4", "text": "mypassword123", "targetId": "<targetId>" } }
```

**Step 5: Click the login button**
```json
{ "action": "act", "request": { "kind": "click", "ref": "e5", "targetId": "<targetId>" } }
```

**Step 6: WAIT then VERIFY — always check the result!**
```json
{ "action": "act", "request": { "kind": "wait", "timeMs": 3000, "targetId": "<targetId>" } }
```
Then take a **snapshot** to check if login succeeded (look for dashboard elements, NOT just the URL):
```json
{ "action": "snapshot", "targetId": "<targetId>", "interactive": true }
```

### Filling Multiple Form Fields at Once (Advanced)

To fill an entire form in one call, use `fill` with a `fields` array:
```json
{
  "action": "act",
  "request": {
    "kind": "fill",
    "targetId": "<targetId>",
    "fields": [
      { "ref": "e3", "type": "fill", "value": "user@example.com" },
      { "ref": "e4", "type": "fill", "value": "mypassword123" }
    ]
  }
}
```
Note: `fill` requires `fields` as an array — do NOT pass `ref`/`text` directly.

### Form Automation Tips

1. **CRITICAL: `type` APPENDS text — it does NOT clear the field first!** Always select-all before typing:
   - Click the field first: `{ "kind": "click", "ref": "e3" }`
   - Select all: `{ "kind": "press", "key": "Control+a" }`
   - Then type: `{ "kind": "type", "ref": "e3", "text": "value" }`
2. **Use `fill` for multi-field form submission** — `fill` requires a `fields` array: `{ "kind": "fill", "fields": [{"ref": "e3", "type": "fill", "value": "text"}] }`.
3. **CRITICAL: Never use `fill` with `ref`/`text` directly** — this will cause "fields are required" errors.
4. **Always include `targetId`** in every request after the initial navigate. Get it from the navigate response.
5. **Always snapshot first** to get element refs. Refs change on every page load.
6. **Use `interactive: true`** in snapshot to only see clickable/fillable elements.
7. **ALWAYS verify login/form results** — after clicking submit, WAIT 3 seconds then take a SNAPSHOT to check the page state. Don't assume success or failure from the click response alone.
8. **For submit**, either click the submit button OR use `type` with `submit: true` on the last field (this presses Enter).
9. **If a button click doesn't work**, try `press` with `key: "Enter"` as an alternative.
10. **Pass each step's tool call SEQUENTIALLY** — do not send type and click in parallel. Wait for each to complete.
11. **On retry, navigate to a fresh page** — don't try to re-fill existing fields that may have stale content.

### Notes

- Browser runs headless (no visible window) inside the Docker container
- Screenshots are served at `/__openclaw__/canvas/<filename>` for display
- Default viewport: 1280x800
- Chromium is auto-installed on container restart


---

## Model Restrictions — READ THIS BEFORE CHANGING MODELS

**You are NOT allowed to change your primary model. Your primary model is `zai/glm-5` — this is set by the boss and must stay.**

For heartbeat/background tasks, you may ONLY use `openai/gpt-4o-mini`. Do NOT use `openai/gpt-4o` — the API key does not have access to it and it will break everything.

**Allowed models:**
- `zai/glm-5` — primary (DO NOT CHANGE)
- `openai/gpt-4o-mini` — heartbeat/subagent tasks only

**Forbidden models (will cause errors):**
- `openai/gpt-4o` — NO ACCESS
- Any anthropic model — NO API KEY
- Any model not listed above

If the boss asks you to change models, confirm with them first before applying. Never change your own model on your own initiative.
