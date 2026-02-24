# SELA CRM Redesign - Premium Admin Panel

## Design System

### Color Palette
- **Primary Sidebar:** Deep slate (#1e293b) with subtle gradient
- **Background:** Clean off-white (#f8fafc)
- **Accent (SELA Brand):** Burnt orange/amber (#f59e0b) + Gold (#fbbf24)
- **Success:** Emerald (#10b981)
- **Warning:** Amber (#f59e0b)
- **Danger:** Rose (#f43f5e)
- **Text Primary:** Slate (#0f172a)
- **Text Secondary:** Slate (#64748b)
- **Cards:** White (#ffffff) with soft shadows

### Typography
- **Font:** Inter (already using via Tailwind)
- **Headings:** Bold, tight tracking
- **Body:** Regular, relaxed line height

### UI Elements
- **Cards:** Rounded-xl, soft shadows, subtle borders
- **Buttons:** Rounded-lg, smooth transitions
- **Inputs:** Rounded-lg, focus rings
- **Glassmorphism:** Backdrop blur on overlays

---

## Layout Wireframe

```
┌──────────────────────────────────────────────────────────────────────┐
│  SELA CRM                                              🔔  👤 Way    │
├────────────┬─────────────────────────────────────────────────────────┤
│            │                                                          │
│  📊 Dashboard   │  DASHBOARD HOME                                    │
│            │  ┌─────────────────────────────────────────────────────┐│
│  👥 Leads       │  │  💰 Revenue This Month        │  📈 Conversion Rate││
│            │  │     $24,500 / $83,333        │        32%          ││
│  📅 Calendar    │  │     ████░░░░░░░░░░░░░░░░░░░░  │   ▲ +5% vs last    ││
│            │  └─────────────────────────────────────────────────────┘│
│  📋 Quotes      │  ┌─────────────────────────────────────────────────┐│
│            │  │  🔧 Active Jobs (4)    │  ⚠️ Needs Action (7)        ││
│  🔧 Installs    │  │  • Johnson - Cabinets arriving today           ││
│            │  │  • Patel - Install scheduled Wed                  ││
│  💬 Messages    │  │  • 3 leads haven't been followed up             ││
│            │  └─────────────────────────────────────────────────────┘│
│  🤖 Chatbot     │  ┌─────────────────────────────────────────────────┐│
│            │  │  📊 LEAD PIPELINE SNAPSHOT                        ││
│  ⚙️ Settings    │  │  New(5) → Consultation(3) → Quoted(2) → Won(1) ││
│            │  │  ┌───┐ ┌───┐ ┌───┐ ┌───┐                          ││
│            │  │  │ 5 │→│ 3 │→│ 2 │→│ 1 │                          ││
│            │  │  └───┘ └───┘ └───┘ └───┘                          ││
│            │  └─────────────────────────────────────────────────────┘│
│            │                                                          │
│  ──────────  │                                                          │
│  Sign Out    │                                                          │
└────────────┴─────────────────────────────────────────────────────────┘
```

---

## Page Structure

### 1. Dashboard (Home)
- Revenue tracker (actual vs target)
- Conversion funnel
- Active jobs widget
- Needs action alerts
- Lead pipeline mini-view
- Recent activity feed

### 2. Leads (Kanban Board)
- Drag-and-drop columns
- Lead cards with quick info
- Slide-out detail panel
- Quick actions (call, email, schedule)

### 3. Calendar
- Month/Week view
- Installations highlighted
- Consultations highlighted
- Crew assignments

### 4. Quotes/Estimates
- Quote builder
- Status tracking
- PDF generation
- Approval workflow

### 5. Installations
- Active jobs list
- Crew management
- Status updates
- Photo uploads

### 6. Messages (Chat Logs)
- AI-summarized conversations
- Extract to Lead button
- Customer quick-view

### 7. Chatbot Config
- System prompt editor
- Welcome message
- Training data
- Performance metrics

### 8. Settings
- Business info
- User management
- Integrations
- Notifications

---

## Implementation Order

1. ✅ Design system & color tokens
2. 🔨 New sidebar component
3. 🔨 Dashboard layout with widgets
4. 🔨 Kanban board for leads
5. 🔨 Calendar view
6. 🔨 Quote builder
7. 🔨 Chat AI summaries
8. 🔨 Installations tracker

---

*Ready to build. Starting with the new sidebar and dashboard.*
