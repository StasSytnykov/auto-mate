# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint (v9 flat config with Next.js core-web-vitals + typescript rules)
```

No test framework is configured.

## Architecture

The project follows **Feature-Sliced Design** (FSD):

```
src/
├── app/                        # Next.js App Router (pages, layouts, API routes)
├── features/vehicle-analysis/  # Main feature module
│   ├── model/                  # Types (types.ts) and Zod schemas (schemas.ts)
│   ├── api/                    # API clients, prompt building, React hooks
│   └── ui/                     # Form components and result display
├── shared/                     # Reusable UI primitives and utilities
│   ├── ui/                     # shadcn/ui components + custom form wrappers
│   ├── lib/utils.ts            # cn() utility (clsx + tailwind-merge)
│   └── config/seo.ts           # SEO metadata and JSON-LD schemas
└── widgets/header/             # Header widget
```

## Tech Stack

- **Next.js 16** (App Router, React 19, TypeScript strict mode)
- **TailwindCSS 4** with PostCSS plugin (`@tailwindcss/postcss`)
- **shadcn/ui** (new-york style, Radix UI primitives, Lucide icons)
- **AI SDK v5** (`ai` + `@ai-sdk/google`) — streaming responses with Google Gemini 2.5 Flash
- **Zod** for form and API validation
- **Upstash Redis** for rate limiting (5 requests/24h sliding window)
- **Vercel Analytics** integrated in root layout

## Key Patterns

- **Path alias**: `@/*` maps to `src/*`
- **shadcn aliases**: components install to `@/shared/ui`, utils to `@/shared/lib/utils` (configured in `components.json`)
- **Streaming AI**: Frontend uses `useCompletion` from `@ai-sdk/react`; backend uses `streamText` from `ai` with `toTextStreamResponse()`
- **VIN decoding**: Dual strategy — NHTSA API for North American VINs, local WMI-based decoding for European/Asian VINs (see `features/vehicle-analysis/api/decode-vin.ts`)
- **Rate limiting**: Conditional — only active when `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set; gracefully skipped otherwise
- **Form components**: Decomposed into field groups (`VinField`, `VehicleInfoFields`, `EngineFields`, etc.) using shared `FormField` wrapper for labels, errors, and accessibility

## Environment Variables

Required in `.env.local`:
```
GEMINI_API_KEY=<from https://aistudio.google.com/app/apikey>
```

Optional (enables rate limiting):
```
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

Optional (for SEO/sitemap):
```
NEXT_PUBLIC_SITE_URL=  # defaults to https://automate.vercel.app
```

## Conventions

- UI text is in **Ukrainian** language
- Commit messages follow **conventional commits** pattern
- Dark theme by default (configured via CSS variables in `globals.css`)
