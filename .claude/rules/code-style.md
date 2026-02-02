---
paths:
  - "src/**/*.{ts,tsx}"
---

# Code Style

- All code, comments, and variable names in **English**
- TypeScript **strict mode** — no `any`, prefer explicit types
- Use `'use client'` directive only when needed (event handlers, hooks, browser APIs)
- Server Actions in `src/app/actions.ts` — all gateway calls go through here
- Use `@/` import alias for all internal imports
- Use `cn()` from `@/lib/utils` for conditional class merging
- Use Framer Motion for all animations — never CSS transitions for interactive elements
- Icons from `lucide-react` — consistent size (h-4 w-4 for inline, h-5 w-5 for buttons)
- Run `npm run typecheck && npm run lint` before committing
