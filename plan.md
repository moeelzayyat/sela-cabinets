# SELA Cabinets CRM — Full Upgrade Plan

## Business Context

SELA Cabinets is a kitchen & cabinet company based in Detroit, Michigan.
Website: selacabinets.com | Phone: (313) 246-7903

The CRM is a custom-built internal operations hub used to manage leads, quotes, installations, and chatbot conversations.

---

## Current State (What Already Exists)

- **Dashboard** — Shows Win Deals, Total Leads, Chat Sessions, Active Jobs, Lead Pipeline summary, Recent Leads & Recent Chats
- **Leads Pipeline** — Kanban board with stages: New Inquiry → Contacted → Consultation → Quote Sent → Deposit Paid → Cabinets Ordered → Installation → Complete
- **Lead Detail Panel** — Contact info (phone, email, address), Source, Timeline, Style Preference, Notes, Create Quote button, Update Status button
- **Calendar** — Placeholder ("Coming Soon")
- **Quotes** — Placeholder ("Coming Soon")
- **Installs** — Placeholder ("Coming Soon")
- **Messages** — Chat session viewer showing bot + user messages. Stats: Total Sessions, Total Messages, User Messages, Bot Responses
- **Chatbot Config** — System prompt editor, welcome message editor

---

## Phase 1 — Revenue-Critical (Build First)

### 1.1 Quote Builder (Quotes Page)

Replace the "Coming Soon" placeholder with a fully functional quote system.

**Features:**
- Create new quote from a lead record (pre-fills customer name, address, contact)
- Line items table:
  - Description (free text or select from product catalog)
  - Quantity
  - Unit price
  - Discount (% or flat)
  - Line total (auto-calculated)
- Quote sections: Cabinets, Hardware, Labor, Countertops, Delivery, Other
- Subtotal, Tax (%), Grand Total — all auto-calculated
- Quote status: Draft → Sent → Viewed → Accepted → Declined → Expired
- Expiration date field
- Internal notes field (not visible to customer)
- Terms & conditions text block (editable default)
- **PDF generation** — branded SELA Cabinets PDF with logo, customer info, line items, totals, terms, signature line
- **Email quote** — send PDF directly from CRM to customer email
- Deposit request — specify deposit amount/percentage required
- Quote history per lead — list of all quotes tied to a lead with version numbers

**Quote List View:**
- Table: Quote #, Customer, Amount, Status, Created Date, Expiration, Actions
- Filter by status, date range
- Search by customer name or quote number

---

### 1.2 Lead Detail Panel — Upgrades

Expand the existing slide-out panel with the following additions:

**New Fields:**
- Budget (dropdown: Under $5k / $5k–$10k / $10k–$20k / $20k+ / Unknown)
- Project type (multi-select: Kitchen / Bathroom / Laundry / Office / Other)
- Kitchen/room size (sq ft — number input)
- Cabinet line/brand preference (text or dropdown)
- Referral source (dropdown: Google Search / Google Maps / Instagram / Facebook / Referral / Website / Walk-in / Other)
- Lead priority/temperature (Hot 🔥 / Warm 🟡 / Cold 🔵 — toggle badge)
- Next follow-up date (date picker with time)
- Assigned to (dropdown — user/team member)

**Activity Timeline:**
- Chronological log of all actions on this lead
- Auto-logged: status changes, notes added, quote created, quote sent, appointment scheduled
- Manual entries: Call logged, Email sent, SMS sent, Meeting note
- Each entry shows: type icon, timestamp, user who did it, note text

**Quick Action Buttons at top of panel:**
- 📞 Call (click-to-call or copy number)
- ✉️ Email (open mailto or compose modal)
- 💬 SMS (open SMS compose modal — requires Twilio integration)
- 📅 Schedule (open appointment scheduler)
- 🏷️ Create Quote

**Linked Records section:**
- Show all quotes linked to this lead (quote #, amount, status)
- Show linked installation job if exists (job ID, scheduled date, status)

---

## Phase 2 — Operations & Efficiency

### 2.1 Calendar / Scheduling

Replace placeholder with a full calendar system.

**Features:**
- Monthly, weekly, and daily views
- Event types:
  - Site Measure / Consultation
  - Installation Day
  - Follow-up Call
  - Delivery
- Create event from lead panel or calendar directly
- Each event links to a lead/customer record
- Crew assignment — assign team member(s) to each event
- Color-coded by event type
- **Google Calendar sync** (two-way if possible, one-way sync minimum)
- Automated reminders:
  - 24 hours before: SMS/email to customer
  - 2 hours before: SMS/email to customer
  - Morning-of: notification to assigned crew
- Drag-and-drop rescheduling
- Mobile-friendly view for crew use on-site

---

### 2.2 Installation Tracker (Installs Page)

Replace placeholder with a job management system.

**Features:**
- Create an installation job from a lead (when lead reaches "Cabinets Ordered" stage)
- Job record contains:
  - Customer name, address, contact
  - Linked lead & quote
  - Cabinet line and order details
  - Assigned crew members
  - Scheduled install date(s)
  - Job status with phases:
    - Measure Complete
    - Order Placed
    - Order Confirmed
    - Cabinets Delivered
    - Install In Progress
    - Final Walkthrough
    - Punch List
    - Complete
- **Progress photos** — upload photos per job, organized by phase
- **Punch list** — add / check off snag items before job is marked complete
- Job notes / internal comments
- Job list view:
  - Table: Job ID, Customer, Address, Scheduled Date, Crew, Status, Actions
  - Filter by status, date, crew member

---

### 2.3 Contacts Module (New Page)

Separate from leads — for ongoing relationships.

**Types of contacts:**
- Past customers (converted from won leads)
- Suppliers / vendors
- Contractors / referral partners
- Crew members (internal)

**Features:**
- Contact record: name, company, phone, email, address, type, notes, tags
- Link contacts to multiple jobs/quotes
- Contact history (past projects completed with them)
- Quick search global

---

### 2.4 Products / Catalog (New Page)

Used in the Quote Builder to speed up line item entry.

**Features:**
- Add products/services with: Name, SKU, Description, Default Price, Category
- Categories: Cabinet Boxes, Door Styles, Hardware, Labor, Countertops, Accessories
- Products auto-populate in the quote line item selector
- Toggle visibility (active/inactive)

---

## Phase 3 — Intelligence & Analytics

### 3.1 Dashboard Upgrades

Replace simple stat cards with a data-rich dashboard.

**New Metrics:**
- Total open pipeline value ($) — sum of all active quotes
- Monthly revenue closed (chart — bar graph by month, last 12 months)
- Leads by source (pie/donut chart)
- Conversion rate: Leads → Quoted → Won (funnel chart)
- Average deal size
- Average time-to-close (days from lead created to won)
- Win rate %
- Overdue follow-ups (list — leads with follow-up date past due)
- Upcoming appointments this week (list)
- Jobs scheduled this week (list)
- Chatbot lead capture rate (how many chats became leads)

**Quick-access widgets:**
- "Needs Action" panel (already exists — expand it)
- Recent activity feed

---

### 3.2 Reports Page (New Page)

Exportable reports with date range filters.

**Report types:**
- Leads Report: source, status, count, conversion rate
- Revenue Report: quotes won, avg deal value, monthly totals
- Installation Report: jobs completed, on-time %, crew performance
- Chatbot Report: sessions, leads captured, common questions asked
- Custom date range filter for all reports
- Export to CSV / PDF

---

### 3.3 Notifications & Alerts System

- In-app notification bell (already partially exists — build it out)
- Notification types:
  - New lead arrived
  - Lead follow-up overdue
  - Quote viewed by customer
  - Quote expiring in 48 hours
  - New chat message
  - Installation due tomorrow
  - Payment received
- Email digest option (daily summary email to owner)

---

## Phase 4 — Scale & Automation

### 4.1 SMS Integration (Twilio)
- SMS inbox inside Messages module
- Send SMS from lead panel
- SMS templates (e.g., "Hi [Name], just following up on your quote...")
- Auto-SMS on trigger: quote sent, appointment confirmed, install reminder

### 4.2 Email Integration
- Send emails from lead panel with tracked open/click
- Email templates for common scenarios
- Quote email auto-send with PDF attachment
- Follow-up drip sequences for cold leads (basic automation)

### 4.3 Payment Tracking
- Log payments received per job
- Track: deposit paid, balance due, final payment received
- Payment status badge on lead/job card
- Integration option: Stripe / Square / PayPal links

### 4.4 Customer Portal (Future)
- Unique link per customer
- Customer can: view their quote, e-sign, pay deposit, view job status & photos
- Reduces back-and-forth calls significantly

### 4.5 Team & User Roles
- Multiple user accounts (owner, office manager, crew lead)
- Role permissions:
  - Owner: full access
  - Office staff: leads, quotes, calendar, messages
  - Installer: install jobs and calendar only
- Activity tracked per user

---

## UI/UX Improvements (Apply Throughout)

- **Global search bar** at top — search leads, quotes, jobs by name or phone number
- **Dark mode toggle** — user preference saved
- **Collapsible sidebar** — toggle to icon-only mode for more screen space
- **Mobile-responsive layout** — optimized for phones/tablets (for crew on-site)
- **Quick-add floating button (+)** — create lead, quote, or appointment from any page
- **Breadcrumb navigation** — e.g., Leads > Way Galaxy > Quote #003
- **Keyboard shortcuts** — N for new lead, Q for new quote, etc.
- **Better color system** for status badges — clearer visual hierarchy
- **Empty state illustrations** — instead of plain "Coming Soon" text on blank pages
- **Confirmation dialogs** for destructive actions (delete lead, archive quote)
- **Toast notifications** for all save/update actions ("Lead updated ✓")

---

## Chatbot Improvements

- **Auto lead creation from chat** — when chatbot collects name + phone, automatically create a lead record
- **Lead capture form flow** — structured questions before free chat: name → phone → project type → timeline
- **Conversation tagging** — tag chats as: lead captured / question only / spam
- **Quick reply buttons** in chat widget for common responses
- **Chatbot analytics** — top questions asked, busiest hours, lead capture rate

---

## Technical Requirements / Notes

- All data must persist to database (no localStorage for production data)
- All forms must validate inputs before saving
- All monetary values displayed in USD format
- Dates displayed in readable format (Feb 23, 2026)
- All list views must be paginated (25 items per page default)
- API endpoints needed for: leads, quotes, contacts, products, jobs, events, payments, users
- PDF generation must include SELA Cabinets logo, brand colors (#orange primary)
- Mobile breakpoints: 320px, 768px, 1024px, 1440px
- All pages must have loading states and error states

---

## Brand / Style Guide

- **Primary color:** Orange (as seen in current UI — use consistently for CTAs, badges, accents)
- **Sidebar:** Dark navy/charcoal (#1a1f2e or similar)
- **Background:** Light gray (#f5f6fa)
- **Cards:** White with subtle shadow
- **Font:** Current sans-serif — keep consistent
- **Logo:** SELA Cabinets star logo — use in PDF headers and customer-facing pages
