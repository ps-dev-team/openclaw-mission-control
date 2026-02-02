# Dashboard Pixel-Perfect Spec

Based on Figma frames: Online.png (light) and idle.png (dark).

## Global

- **Background:** Full-screen bg image with semi-transparent overlay. Light: `#F0EEEB/80`, Dark: `#1A1A1A/80`
- **Card effect:** `background-blur: 20px`, `drop-shadow: 0 0 24px rgba(0,0,0,0.04)`, `border-radius: 12px`
- **Card bg (light):** `rgba(255,255,255,0.6)` — NOT opaque white, the bg image shows through
- **Card bg (dark):** `rgba(40,40,40,0.6)` — semi-transparent dark
- **Border radius:** Cards=12px, pills=112px, small elements=8px, tags=4px
- **Spacing:** 24px gap between cards, 12px internal padding between sections
- **Icons:** All lucide-react, size 20x20 (h-5 w-5) for card-level icons, 16x16 for inline

## Layout (3 columns)

```
┌──────────────────┬──────────────────┬──────────────────┐
│                  │                  │                  │
│  Agent Status    │  Activity Log    │  Brain           │
│  (tall card)     │  (medium)        │  (tall card)     │
│                  │                  │                  │
│                  ├──────────────────┤                  │
│                  │                  │                  │
│                  │  Costs           ├──────────────────┤
│                  │  (medium)        │                  │
│                  │                  │  Memory          │
│                  │                  │  (tall card,     │
│                  │                  │   scrollable)    │
│                  │                  │                  │
└──────────────────┴──────────────────┴──────────────────┘
```

- Column width: ~400px each (flex, equal)
- Gap: 24px
- NO "Quick Access" card — does NOT exist in Figma
- NO "Cron Jobs" card on dashboard — it's a separate page
- Cards auto-height based on content

## TopBar

- Left: "OpenClaw" in Audiowide 400, 32px + "Mission Control" in Audiowide 400, 32px (lighter weight visually)
- Right: Settings gear icon (lucide `Settings`, inside rounded square button 48x48, border-radius 12px) + Profile pill (border-radius 112px, contains: "Berto 🦞" text + avatar image + dropdown chevron)
- Height: ~64px, padding: 24px horizontal

## LeftNav (floating, left side)

- 3 icon buttons, vertically stacked, centered on left edge
- Each: 48x48, border-radius 12px, glass effect
- Icons (top to bottom): `FolderOpen` (files), `MessageSquare` (sessions/chat), `Timer` (crons/automations)
- NO dashboard icon — dashboard IS the main view
- Vertical gap: 8px between buttons
- Position: fixed, left: 16px, vertically centered

## Agent Status Card (Column 1)

### Header
- **Avatar:** 48x48 circular image (user's profile photo), left side
- **Name:** "Berto 🦞" — Inter 700, 20px, next to avatar
- **Status:** Below name, green dot (8px circle, `#00A955`) + "online" text (Geist Mono 500, 14px, `#CBCBCB`)
- **JSON button:** Top-right corner, `{ }` text inside 36x36 square button (border-radius 8px, border)

### Sections (3 rows)
Each row has the same structure:
- **Label:** Geist Mono 900, 10px, uppercase, tracking-wider, color `#CBCBCB` (muted)
- **Content row:** Icon (lucide, 20x20, color `#CBCBCB`) + Value text (Geist Mono 600, 14px, `#111111`) + Expand button (lucide `Maximize2`, right-aligned, 20x20)
- **Spacing:** 16px between sections, 4px between label and content

Row 1: Label "CHANNELS" → Icon `Globe` + "4 channels" + expand
Row 2: Label "SKILLS" → Icon `Wrench` + "64 (12 workspace)" + expand  
Row 3: Label "HEARTBEATS" → Icon `HeartPulse` + "4 Heartbeat actions" + expand

### System Info Panel (bottom, recessed)
- Slightly indented/recessed look: lighter bg, `border-radius: 8px`, subtle border
- 3 rows, each with icon + text:
  - Row 1: Icon `Bot` (20x20) + "claude-opus-4-5" (Geist Mono 600, 12px)
  - Row 2: Icon `Globe` (20x20) + "port 18789, local | Concurrency: 4/8" (Geist Mono 600, 12px)
  - Row 3: Icon `Clock` (20x20) + "2D 14h 36m" (left) + "v2026.1.24-3" (right-aligned) (Geist Mono 600, 12px)
- Spacing: 8px between rows, padding: 12px

## Activity Log Card (Column 2, top)

### Header
- Icon `AlignJustify` (lucide, 20x20) + "Activity log" (Inter 700, 18px) + expand button `ArrowUpRight` (right-aligned, 20x20 inside 36x36 button)
- Separator line below header

### Content
- List of recent activity entries (sessions + cron runs mixed, chronological)
- Empty state: "No active sessions"

## Brain Card (Column 3, top)

### Header
- Icon `Brain` (lucide, 20x20) + "Brain" (Inter 700, 18px)
- Separator line below header

### File entries (4 rows)
Each row:
- **Icon:** Custom per file (lucide, 20x20): `Sparkles` (SOUL), `BookOpen` (AGENTS), `UserSquare` (IDENTITY), `Users` (USER)
- **Title:** Description text (Inter 600, 16px, `#111111`) — e.g., "Personality and tone"
- **Metadata:** Filename + size + date (Geist Mono 700, 12px, `#CBCBCB`) — e.g., "SOUL.md | 1.7kb | 12/12/2026"
- **Edit button:** Pencil icon `Pencil` (right-aligned, 20x20 inside 36x36 button)
- **Separator:** Thin line between entries (except last)

File mapping:
1. SOUL.md → "Personality and tone" → icon `Sparkles`
2. AGENTS.md → "Operating instructions" → icon `BookOpen`  
3. IDENTITY.md → "Name, emoji, avatar" → icon `BadgeCheck` or `UserSquare2`
4. USER.md → "Info about the human" → icon `Users`

## Costs Card (Column 2, bottom)

### Header
- Icon `DollarSign` (inside circle) + "Costs" (Inter 700, 18px) + expand button `ArrowUpRight`

### Content
- Token usage summary, cost breakdown (placeholder for now)

## Memory Card (Column 3, bottom)

### Header
- Icon `Brain` (variant) + "Memory" (Inter 700, 18px) + expand button `ArrowUpRight`

### MEMORY.md entry
- Icon `Archive` or `BookMarked` (20x20) + "Long term memory" (Inter 600, 16px)
- Metadata: "MEMORY.md | 1.7kb | 12/12/2026" (Geist Mono 700, 12px)
- Edit button `Pencil` (right-aligned)

### Daily episodes (scrollable list)
Each episode:
- **Thumbnail:** Dark square with "TODAY" badge (or date for older ones), border-radius 8px
- **Title:** "Title of the episode..." (Inter 600, 14px)
- **Description:** Truncated preview text (Inter 400, 12px, `#CBCBCB`)
- **Expand button:** `ArrowUpRight` (right-aligned)

## Theme Rules
- Agent online → light mode (bg `#F0EEEB`)
- Agent idle/offline → dark mode (bg `#1A1A1A`)
- NOT a user toggle — agent state controls theme
- Both modes visible in Figma (Online.png = light, idle.png = dark)
