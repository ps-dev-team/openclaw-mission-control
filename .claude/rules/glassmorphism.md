---
paths:
  - "src/components/**/*.{ts,tsx}"
---

# Glassmorphism Card Conventions

All dashboard cards use the `GlassCard` component from `src/components/glass-card.tsx`.

## Card Styling
- Use `backdrop-blur: 24px` (via Tailwind `backdrop-blur-[24px]` or the `.glass` utility)
- Border radius: `12px` (`rounded-xl`)
- Box shadow: `0 8px 32px rgba(0, 0, 0, 0.04)`
- Semi-transparent background that adapts to theme (light/dark)
- Subtle border: `border border-white/[0.06]` (dark) or `border border-black/[0.06]` (light)

## Animation
- All cards use Framer Motion for entrance animation
- Stagger children in grids using `CardGrid` container
- Hover effect: `translateY(-4px)` with shadow increase
- Card → Modal transitions use `layoutId` prop

## Typography in Cards
- Card title: Inter 700, 18px
- Section labels: Geist Mono 900, 10px, uppercase (e.g., "CHANNELS", "SKILLS")
- Data values: Geist Mono 600, 12-14px
- Descriptions: Inter 600, 16px
- Body text: Inter 400, 14px
- File metadata: Geist Mono 700, 12px (e.g., "SOUL.md | 1.7kb | 12/12/2026")

## Theme
- The theme is controlled by agent state (online → light, idle → dark)
- Use Tailwind dark: variant for dark mode styles
- Never add a manual theme toggle — the agent state IS the theme
