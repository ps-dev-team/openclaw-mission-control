# OpenClaw Mission Control 🚀

Open-source dashboard for monitoring and managing AI agents running on [Clawdbot/OpenClaw](https://github.com/clawdbot/clawdbot).

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- **Agent State** — Real-time online/offline/active status with auto-polling
- **Memory Viewer** — Browse MEMORY.md and daily notes with markdown rendering
- **Skills** — See all installed skills with descriptions
- **Cron Jobs** — Monitor scheduled tasks with run history
- **Heartbeat Editor** — Edit HEARTBEAT.md to control periodic checks
- **Sessions** — List active sessions with chat-like history viewer
- **Costs** — Token usage and cost breakdown per session
- **Config** — View gateway configuration (secrets auto-masked)
- **Multi-Agent** — Connect and switch between multiple agents
- **Security** — Gateway tokens stay server-side, never reach the browser

## Quick Start

```bash
# Clone
git clone https://github.com/ps-dev-team/openclaw-mission-control.git
cd openclaw-mission-control

# Install
npm install

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and add your first agent.

## Adding an Agent

You need:
1. **Gateway URL** — Your Clawdbot gateway address (e.g., `http://localhost:18789`)
2. **Gateway Token** — The auth token from your `clawdbot.json` config

The dashboard proxies all requests through the Next.js server — tokens never reach the browser.

## Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4
- **State:** Zustand
- **Charts:** Recharts
- **Markdown:** react-markdown + remark-gfm
- **Icons:** Lucide React

## Design

- Dark mode first (NASA meets developer dashboard)
- Fonts: Inter (UI) + JetBrains Mono (data)
- Secret sanitization (`ntn_*`, `sk-*`, `ghp_*`, etc. → `••••••`)
- Polling-based updates (5s active, 30s idle)

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `COOKIE_SECRET` | No | 32+ char secret for cookie encryption (has a default for dev) |

## Development

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run lint      # ESLint
npm run format    # Prettier
npm run typecheck # TypeScript check
```

## License

MIT — See [LICENSE](./LICENSE)

## Contributing

PRs welcome! This is an open-source project for the Clawdbot/OpenClaw community.
