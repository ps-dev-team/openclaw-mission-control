# openclaw-mission-control

Open-source dashboard for monitoring AI agents on Clawdbot/OpenClaw. Connects to gateway APIs and displays agent state, memory, skills, automations, sessions, and costs.

## Architecture

```
src/
  app/                          # Next.js App Router
    layout.tsx                  # Root layout (fonts, metadata)
    page.tsx                    # Home — add first agent or redirect
    agent/[id]/                 # Agent dashboard routes
      page.tsx                  # Dashboard (server shell)
      dashboard-client.tsx      # Dashboard client component (all cards)
      layout.tsx                # Agent layout (shared wrapper)
      sessions/page.tsx         # Sessions page
      crons/page.tsx            # Crons page
      config/page.tsx           # Config page
      memory/page.tsx           # Memory page
      skills/page.tsx           # Skills page
      costs/page.tsx            # Costs page
      heartbeat/page.tsx        # Heartbeat page
    agents/add/page.tsx         # Add agent form
    actions.ts                  # Server Actions (proxy to gateway)
  components/
    dashboard-layout.tsx        # Full layout: bg image, overlay, topbar, leftnav
    top-bar.tsx                 # Header: logo, settings, profile pill
    left-nav.tsx                # 3 floating icon buttons (left side)
    glass-card.tsx              # Base glassmorphism card (Framer Motion)
    card-grid.tsx               # 3-column responsive grid
    panel.tsx                   # Shared panel components (StatusBadge, etc.)
    sidebar.tsx                 # [DEPRECATED — being removed]
    ui/                         # shadcn/ui primitives (button, badge, dialog, etc.)
  lib/
    constants.ts                # Poll intervals, secret patterns
    cookies.ts                  # Agent connection storage (iron-session)
    gateway.ts                  # Gateway API client (server-only)
    theme.tsx                   # Theme context (online=light, idle=dark)
    types.ts                    # TypeScript types for API data
    utils.ts                    # cn() helper
  stores/
    agent-store.ts              # Zustand store
public/
  bg-dashboard.jpg              # Full-screen background image
docs/
  figma/                        # Figma exports and tokens
```

## Design System

### Visual Style
- **Background:** Full-screen fixed image with semi-transparent overlay
- **Cards:** Glassmorphism — `backdrop-blur: 24px`, `border-radius: 12px`, `box-shadow: rgba(0,0,0,0.04)`
- **Theme:** Agent state controls theme (online = light, idle/offline = dark). NOT a user toggle.
- **Layout:** No sidebar. 3-column card grid (400px cols, 24px gap). Scrollable vertically.

### Fonts
- **Audiowide** — Logo/title only (32px, regular)
- **Inter** — All UI text (400/600/700, sizes 14-20px)
- **Geist Mono** — Data values, labels, file info (500/600/700/900, sizes 10-16px)

### Colors
- Light mode bg: `#F0EEEB` (warm off-white)
- Dark mode bg: `#1A1A1A` (near-black)
- Card bg: semi-transparent with backdrop-blur
- Status green: `#00A955`
- Error red: `#E90303`
- Text: `#111111` (light) / `#E1E1E1` (dark)

### Animations (Framer Motion)
- Card entrance: stagger children, `opacity: 0 → 1`, `y: 12 → 0`
- Card hover: `translateY(-4px)` with shadow increase
- Card → Modal: `layoutId` animation
- Accordion: `AnimatePresence` with `height: 0 → auto`

### Figma Reference
- File key: `o3D5rBRIwPmiY5OOgLGvi7`
- Tokens: `docs/figma/figma-tokens.json`
- Exports: `docs/figma/Online.png`, `docs/figma/idle.png`

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run typecheck    # TypeScript check (tsc --noEmit)
npm run lint         # ESLint
npm run format       # Prettier write
npm run format:check # Prettier check
npm run test         # Vitest
```

## Code Conventions

- **Language:** All code, comments, variables in English
- **TypeScript:** Strict mode
- **Formatting:** Prettier (see config)
- **Linting:** ESLint with Next.js config
- **Package manager:** npm
- **Components:** React functional components with TypeScript
- **State:** Zustand for global, React state for local
- **Styling:** Tailwind CSS v4 + cn() utility
- **Animations:** Framer Motion (never CSS transitions for interactive elements)
- **Server/Client:** Gateway calls are server-only (Server Actions). Client components marked with `'use client'`
- **Imports:** Use `@/` path alias for all imports

## Gateway API

All data comes from the Clawdbot gateway API, proxied through Server Actions in `src/app/actions.ts`. Gateway tokens never reach the browser.

Key endpoints:
- `GET /api/status` — Agent online/offline, model, uptime
- `GET /api/sessions` — List sessions
- `GET /api/session/status?sessionKey=...` — Token/cost per session
- `GET /api/cron/list` — Cron jobs
- `GET /api/config` — Gateway config
- `POST /api/files/read` — Read workspace files
- `POST /api/files/write` — Write workspace files
- `POST /api/files/list` — List directory

## Security

- Gateway tokens stored in encrypted cookies (iron-session)
- All API calls proxied server-side
- Secret patterns auto-masked before rendering (see `sanitize()` in `constants.ts`)

## Dashboard Cards

The dashboard has 7 cards (see `docs/figma/` for visual reference):

1. **Agent Status** — Name, online/offline, channels, skills, heartbeats, model, gateway, uptime, version
2. **Activity Log** — Unified feed across sessions + crons
3. **Brain** — 4 core files (SOUL.md, AGENTS.md, IDENTITY.md, USER.md) with descriptions
4. **Memory** — MEMORY.md preview + daily episode list with TODAY badges
5. **Costs** — Token usage and cost summary
6. **Skills** — Workspace + OpenClaw skills split
7. **Heartbeat** — HEARTBEAT.md items as accordion

## Key Dependencies

- `next` 16 — Framework (App Router)
- `framer-motion` — Animations
- `react-markdown` + `remark-gfm` — Markdown rendering
- `iron-session` — Encrypted cookie sessions
- `zustand` — State management
- `recharts` — Charts (for costs)
- `lucide-react` — Icons
- `@radix-ui/*` — UI primitives (via shadcn/ui)
- `tailwindcss` v4 — Styling
