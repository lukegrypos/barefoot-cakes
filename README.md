# 🎂 Custom Cake Inquiry Form

A beautifully designed multi-step intake form for custom cake orders. Built with Next.js 14, Tailwind CSS, and Resend for email delivery.

---

## Getting Started

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd cake-inquiry
npm install
```

### 2. Set Up Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx   # From resend.com/api-keys
FROM_EMAIL=hello@yourdomain.com          # Verified sender in Resend
BAKER_EMAIL=wife@example.com             # Where inquiries are delivered
```

### 3. Set Up Resend

1. Create an account at [resend.com](https://resend.com)
2. Add & verify your domain (e.g., `yourbakery.com`)
3. Create an API key and paste it into `.env.local`
4. Set `FROM_EMAIL` to match your verified domain

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploying to Vercel

### Via GitHub (Recommended)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repo
4. Add environment variables in Vercel's dashboard:
   - `RESEND_API_KEY`
   - `FROM_EMAIL`
   - `BAKER_EMAIL`
5. Deploy

### Environment Variables in Vercel

Go to your project → **Settings → Environment Variables** and add:

| Variable | Value |
|---|---|
| `RESEND_API_KEY` | Your Resend API key |
| `FROM_EMAIL` | Your verified sender email |
| `BAKER_EMAIL` | Baker's receiving email |

---

## Customization Checklist

- [ ] **Business name** — Update the header in `components/CakeForm.tsx` (search for `TODO`)  
- [ ] **Colors / fonts** — Edit `tailwind.config.ts` and `app/globals.css`  
- [ ] **Lead time copy** — Update "3–4 weeks" notice in Step 2 to match your actual lead time  
- [ ] **Budget ranges** — Adjust pricing tiers in `StepFinalDetails` to match your pricing  
- [ ] **Metadata** — Update `app/layout.tsx` with real business name and description  
- [ ] **Domain** — Connect your custom domain in Vercel settings  

---

## Project Structure

```
cake-inquiry/
├── app/
│   ├── page.tsx              # Entry point
│   ├── layout.tsx            # Root layout + metadata
│   ├── globals.css           # Global styles + Tailwind
│   └── api/
│       └── submit/
│           └── route.ts      # Resend email handler
├── components/
│   └── CakeForm.tsx          # Full multi-step form
├── .env.example              # Environment variable template
└── README.md
```

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [Next.js 14](https://nextjs.org) | Framework (App Router) |
| [Tailwind CSS](https://tailwindcss.com) | Styling |
| [Resend](https://resend.com) | Transactional email |
| [react-dropzone](https://react-dropzone.js.org) | Image uploads |
| [Vercel](https://vercel.com) | Hosting |

---

## How It Works

1. Visitor fills out the 5-step form
2. On submit, images are converted to base64 client-side
3. The Next.js API route receives the payload and sends two emails via Resend:
   - **To the baker** — Full inquiry details + attached inspiration images
   - **To the customer** — Confirmation email with estimated response time
