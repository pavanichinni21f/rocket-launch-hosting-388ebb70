# GUIDESOFT IT SOLUTIONS — AI Assistant

Enterprise-grade AI Chatbot website for **GUIDESOFT IT SOLUTIONS**, powered by advanced language models. Built with React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui, and Lovable Cloud (Supabase) backend.

- 🌐 Website: [www.guideitsol.com](https://www.guideitsol.com)
- ✉️ Contact: [info@guideitsol.com](mailto:info@guideitsol.com)
- 🎨 Designed & Developed by [Praveen UX/UI](https://praveenuxui.com)

---

## ✨ Highlights

- Branded AI Assistant landing page with live interactive chat demo
- GUIDESOFT logo used as favicon, app icon, and primary brand mark
- Deep navy + cyan brand palette derived from the official logo
- Enterprise-focused feature grid (Security, Omnichannel, Automation, Handoff)
- 50+ pre-built pages (Pricing, Features, Blog, Legal, Support, Admin, Dashboard)
- Full authentication (Email, OTP, Google OAuth) via Supabase
- UPI-only Indian payment flow (PayU, Cashfree, GPay)
- Realtime dashboard, notifications, admin panel with RBAC
- Fully responsive, dark/light mode, SEO-ready, WCAG 2.2 accessible

## 🚀 Getting started

```bash
npm install
npm run dev      # dev server on http://localhost:8080
npm run build    # production build
npm run preview  # preview build
```

## 🏗 Tech Stack

| Layer      | Tech                                                     |
|------------|----------------------------------------------------------|
| Frontend   | React 18, Vite 5, TypeScript 5, Tailwind CSS, shadcn/ui  |
| State      | TanStack Query, React Hook Form + Zod                    |
| Animation  | Framer Motion                                            |
| Backend    | Lovable Cloud (Supabase Postgres + Auth + Edge Functions)|
| Payments   | UPI, PayU, Cashfree, Google Pay                          |
| AI         | Lovable AI Gateway (Gemini / GPT class models)           |

## 🔐 Branding

- Logo: `https://www.gsgroups.net/gslogo.png` (mirrored to `/public/favicon.png`)
- Primary color: `#0A2540` (deep navy) with `#00E5FF` cyan accents
- No third-party AI brand marks — all conversational surfaces are branded as
  "GUIDESOFT AI Assistant".

## 🔗 Social

- LinkedIn: https://www.linkedin.com/in/praveenkumarkanneganti/
- Facebook: https://www.facebook.com/pranu21m
- Instagram: https://www.instagram.com/pk_uxui_architect/
- WhatsApp: linked in footer

---

## ✅ Completed

- [x] Full rebrand to GUIDESOFT IT SOLUTIONS (logo, favicon, colors, meta, JSON-LD)
- [x] AI Chatbot landing page with live interactive demo
- [x] Navbar + Footer wired with new branding & socials
- [x] Centered dark footer with "Designed & Developed by Praveen UX/UI"
- [x] SEO metadata: title, description, OG tags, Twitter card, Organization schema
- [x] All 50+ marketing, auth, dashboard, and legal pages functional
- [x] Supabase Auth (email/password, Google OAuth, OTP) with RLS
- [x] UPI payment flow, admin dashboard, support ticketing
- [x] Zero TypeScript build errors — production ready

## 🕗 Optional Future

- Wire the demo chat to the `ai-chat` Supabase Edge Function for live LLM replies
- Add WhatsApp Business API integration for the footer WhatsApp link
- Migrate remaining hosting-legacy copy on `/pricing`, `/features` to AI-focused positioning
- Server-render meta per route via TanStack SSR for perfect social previews

---

## 📦 Deployment

Publish directly from Lovable (top-right **Publish** button) or deploy the
`dist/` output to any static host (Vercel, Netlify, Cloudflare Pages). The
included `vercel.json` sets strict HSTS, CSP, and cache headers.

© GUIDESOFT IT SOLUTIONS. Designed & Developed by [Praveen UX/UI](https://praveenuxui.com).
