# Lead Capture System Setup Guide

## What's Done ✅

1. **Forms Updated**
   - Estimate form capturing all required fields
   - Email notifications updated to info@selatrade.com
   - Notion CRM integration added to code

2. **Database Schema**
   - PostgreSQL/Supabase tables ready
   - Customers and estimates tables

3. **Email System**
   - Resend integration configured
   - Auto-notification to info@selatrade.com when leads come in

## What You Need to Do 🔧

### Step 1: Set Up Notion Database (5 minutes)

1. **Create a Notion account** (if you don't have one)
   - Go to notion.so
   - Sign up for free

2. **Create a new database**
   - Click "+ New Page"
   - Select "Table" database
   - Name it: "SELA Leads"

3. **Add these properties to the database:**
   - `Name` (Title) - already there
   - `Email` (Email)
   - `Phone` (Phone)
   - `Source` (Select: estimate, booking, contact)
   - `Status` (Select: New, Contacted, Quoted, Scheduled, Installed, Complete, Lost)
   - `Date Added` (Date)
   - `Address` (Text)
   - `City` (Text)
   - `ZIP` (Text)
   - `Timeline` (Select)
   - `Style Preference` (Select)
   - `Notes` (Text)
   - `Appointment Type` (Select)
   - `Appointment Date` (Date)

4. **Get Notion API credentials**
   - Go to: https://www.notion.so/my-integrations
   - Click "+ New integration"
   - Name it: "SELA Cabinets CRM"
   - Copy the "Internal Integration Token" (you'll need this)

5. **Share database with integration**
   - Go to your "SELA Leads" database
   - Click "..." (three dots) → "Add connections"
   - Select "SELA Cabinets CRM"
   - Copy the database URL (the part after notion.so/)

### Step 2: Get Email Service API Key (5 minutes)

**Option A: Resend (Recommended - Free tier available)**
1. Go to resend.com
2. Sign up for free account
3. Go to API Keys
4. Create new API key
5. Copy the key (starts with `re_`)

**Option B: Skip email for now**
- Leads will still be captured in database and Notion
- You can add email later

### Step 3: Deploy Updated Website (10 minutes)

**Tell Mango when you're ready with:**
1. Notion API Token
2. Notion Database ID
3. Resend API Key (optional)

I'll:
- Update the live website with the new code
- Set up environment variables
- Test the forms
- Send you a test lead to confirm everything works

---

## What Happens When a Lead Comes In

1. **Customer submits form on website**
   - Estimate request
   - Booking request
   - Contact form

2. **System automatically:**
   - ✅ Saves to database
   - ✅ Adds to Notion CRM
   - ✅ Sends email to info@selatrade.com
   - ✅ Sends confirmation email to customer

3. **You get notified:**
   - Email with all lead details
   - Lead appears in Notion database
   - Status: "New"

4. **You follow up:**
   - Call/text within 30 minutes
   - Update status in Notion to "Contacted"
   - Move through pipeline

---

## Lead Management Workflow

### Status Definitions:
- **New** - Just came in, not contacted yet
- **Contacted** - You've reached out, waiting for response
- **Quoted** - Price provided
- **Scheduled** - Measurement appointment booked
- **Installed** - Job completed
- **Complete** - Paid and happy
- **Lost** - Didn't close (log reason in notes)

### Daily Tasks:
1. Check Notion for new leads (Status: New)
2. Respond within 30 minutes
3. Update status after each interaction
4. Follow up on old leads (Status: Contacted or Quoted)

### Weekly Review:
- How many new leads?
- Close rate by source?
- Oldest uncontacted lead?
- Leads stuck in pipeline?

---

## Environment Variables Needed

When you have the credentials, provide these to Mango:

```
NOTION_API_KEY=secret_xxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxx
RESEND_API_KEY=re_xxxxxxxxxxxxx (optional)
```

---

## Testing the System

Once deployed, test by:
1. Go to selacabinets.lucidsro.com/estimate
2. Submit a test form with your info
3. Check:
   - [ ] Email arrives at info@selatrade.com
   - [ ] Lead appears in Notion
   - [ ] Confirmation email arrives (if Resend configured)

---

## Next Steps After Setup

Once lead capture is working:
- ✅ Set up automated follow-up emails
- ✅ Create lead response templates
- ✅ Set up SMS notifications
- ✅ Install analytics tracking
- ✅ Set up Google Business Profile

---

## Costs

- **Notion**: Free (personal) or $8/month (team)
- **Resend**: Free (3,000 emails/month) or $20/month (50,000)
- **Supabase**: Free tier or $25/month (if using their database)

**Total first month:** $0-53 depending on choices

---

**Questions? Ask Mango.**

**Ready? Provide the credentials and I'll deploy it.**
