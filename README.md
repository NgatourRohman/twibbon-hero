# Twibbon Hero

A production-ready, bilingual Twibbonize-style platform built for communities and campaigns.

## Tech stack

- Next.js 15 App Router + TypeScript
- Tailwind CSS + Shadcn-style UI
- Supabase Auth, PostgreSQL, Row Level Security, and Storage
- React Konva image editor
- Vercel serverless deployment

## Features

- English-first interface with Indonesian language support
- Campaign discovery, search, categories, and public campaign pages
- Creator authentication and dashboard
- Campaign creation, editing, deletion, and moderation
- Transparent PNG frames and campaign banners on Supabase Storage
- Photo drag, zoom, rotate, preview, and PNG/JPG export
- WhatsApp, Facebook, X, and copy-link sharing
- Admin moderation and aggregate usage statistics
- Complete database and Storage RLS policies

## Quick start

```bash
npm install
copy .env.example .env.local
npm run dev
```

Configure `.env.local` with your Supabase project URL and anon key. The full local setup, Supabase configuration, security, and Vercel deployment guide is maintained separately in `README-GUIDE.md`.

## Scripts

```bash
npm run dev
npm run typecheck
npm run lint
npm run build
```

## License

Use and adapt this project for your organization or community.
