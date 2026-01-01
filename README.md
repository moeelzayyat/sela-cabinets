# SELA Cabinets Website

A modern, lead-generating website for SELA Cabinets - a kitchen cabinet supply and installation business in Detroit, Michigan.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (for lead storage & file uploads)
- Calendly account (for scheduling)
- Resend account (for email notifications)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd sela-cabinets

# Install dependencies
npm install

# Copy environment variables
copy env.example.txt .env.local   # Windows
# or
cp env.example.txt .env.local     # Mac/Linux

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## 📁 Project Structure

```
sela-cabinets/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Home page
│   │   ├── services/          # Services page
│   │   ├── products/          # Products page
│   │   ├── gallery/           # Gallery page
│   │   ├── about/             # About page
│   │   ├── faqs/              # FAQs page
│   │   ├── contact/           # Contact page
│   │   ├── book/              # Calendly booking hub
│   │   ├── estimate/          # Estimate request form
│   │   └── actions/           # Server actions
│   ├── components/
│   │   ├── ui/                # ShadCN UI components
│   │   ├── layout/            # Header, Footer, etc.
│   │   ├── sections/          # Page sections
│   │   ├── calendly/          # Calendly integration
│   │   ├── seo/               # JSON-LD schemas
│   │   └── analytics/         # GA4 tracking
│   ├── config/
│   │   └── site.ts            # ⭐ MAIN CONFIGURATION FILE
│   └── lib/
│       ├── utils.ts           # Utility functions
│       ├── supabase.ts        # Supabase client
│       └── analytics.ts       # Analytics helpers
├── public/
│   └── images/                # Image assets
├── env.example.txt            # Environment variables template
└── README.md
```

## ⚙️ Environment Variables

Create a `.env.local` file with these variables:

```env
# Google Analytics 4
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Calendly Links
NEXT_PUBLIC_CALENDLY_PHONE_CONSULTATION=https://calendly.com/your-link/phone
NEXT_PUBLIC_CALENDLY_INHOME_MEASUREMENT=https://calendly.com/your-link/measurement
NEXT_PUBLIC_CALENDLY_VIRTUAL_DESIGN=https://calendly.com/your-link/virtual

# Supabase (for estimates storage)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Resend (for email notifications)
RESEND_API_KEY=re_xxxxxxxx
RESEND_DOMAIN=your-domain.com
OWNER_EMAIL=owner@selacabinets.com

# Google Maps (optional)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key
```

## 🎨 How to Update Content

### Business Information & Service Areas

Edit `src/config/site.ts`:

```typescript
export const siteConfig = {
  name: 'SELA Cabinets',
  phone: '313-246-7903',
  email: 'info@selacabinets.com',
  
  serviceAreas: [
    'Detroit',
    'Dearborn',
    // Add/remove cities here
  ],
  
  // ... more config
}
```

### Calendly Links

1. Create your Calendly event types
2. Add the URLs to `.env.local`:
   ```
   NEXT_PUBLIC_CALENDLY_PHONE_CONSULTATION=https://calendly.com/your-link/phone
   NEXT_PUBLIC_CALENDLY_INHOME_MEASUREMENT=https://calendly.com/your-link/measurement
   NEXT_PUBLIC_CALENDLY_VIRTUAL_DESIGN=https://calendly.com/your-link/virtual
   ```
3. Or update directly in `src/config/site.ts`

### Photos

Add images to `public/images/`:

- `hero-kitchen.jpg` - Hero section background (recommended: 1920x1080+)
- `gallery/` - Project photos
- `styles/` - Cabinet style images (shaker.jpg, flat-panel.jpg, etc.)
- `team/` - Team/about photos

### FAQs

Edit the `faqs` array in `src/config/site.ts`:

```typescript
faqs: [
  {
    question: 'Your question here?',
    answer: 'Your answer here.',
  },
  // ...
]
```

### Cabinet Styles & Finishes

Edit `cabinetStyles` and `cabinetFinishes` in `src/config/site.ts`.

## 📊 Analytics

The site tracks these conversion events:

- `book_click` - When someone clicks to book a consultation
- `estimate_submit` - When an estimate form is submitted
- `call_click` - When someone clicks the phone number
- `form_start` - When someone starts filling a form

View in Google Analytics 4 under Events.

## 🗄️ Database Setup (Supabase)

Create an `estimate_requests` table:

```sql
CREATE TABLE estimate_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  zip TEXT NOT NULL,
  timeline TEXT NOT NULL,
  budget TEXT NOT NULL,
  style TEXT NOT NULL,
  notes TEXT,
  photo_urls TEXT[],
  status TEXT DEFAULT 'new'
);
```

Create a storage bucket for photos:

1. Go to Storage in Supabase
2. Create a bucket named `estimates`
3. Set it to public (or configure RLS as needed)

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Build for Production

```bash
npm run build
npm start
```

## ✅ Acceptance Checklist

- [ ] All 9 pages load correctly
- [ ] Navigation works on desktop and mobile
- [ ] Mobile menu opens/closes
- [ ] Calendly embeds load on /book page
- [ ] Estimate form submits successfully
- [ ] Form validation shows errors for required fields
- [ ] Photo upload works (with Supabase configured)
- [ ] Email notifications send (with Resend configured)
- [ ] Phone click-to-call works on mobile
- [ ] Sticky call button appears on mobile
- [ ] SEO meta tags are present on all pages
- [ ] JSON-LD schema is in page source
- [ ] Site is responsive on all screen sizes
- [ ] Fast page loads (check with Lighthouse)

## 🔧 Troubleshooting

### Calendly not loading?
- Check that the URLs in your env file are correct
- Make sure there are no ad blockers interfering

### Emails not sending?
- Verify your Resend API key
- Check that OWNER_EMAIL is set correctly
- For production, verify your domain in Resend

### Images not showing?
- Add actual image files to `public/images/`
- Check file names match what's referenced in the code

## 📞 Support

For questions about this website:
- Check the code comments
- Review this README
- Contact your developer

---

Built with Next.js 14, TypeScript, Tailwind CSS, and ShadCN UI.

