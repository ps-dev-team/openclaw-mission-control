Of course. As a senior frontend engineer, here is a detailed, pixel-perfect breakdown of the OpenClaw Mission Control dashboard into atomic, reusable components, based on the provided design and tokens.

### Overall Layout & Structure

The dashboard uses a main content area with a three-column grid layout, flanked by fixed-position navigation elements. A large decorative element (the mascot) is positioned in the bottom-left corner, layered underneath the UI cards but above the background.

*   **Grid:** The main card area is a CSS grid with significant gaps. A likely implementation is `display: grid; grid-template-columns: 360px 1fr 1fr; gap: 24px;`. The first column is fixed-width to accommodate the `StatusCard`, while the other two are flexible.
*   **Positioning:**
    *   `DashboardBackground`: `position: fixed`, `z-index: -1`.
    *   `Mascot`: `position: fixed`, `bottom: 0`, `left: 0`, `z-index: 0`.
    *   `LeftNav`: `position: fixed`, `left: 24px`, `top: 50%`, `transform: translateY(-50%)`, `z-index: 10`.
    *   `TopBar`: `position: fixed`, `top: 24px`, `left: 0`, `right: 0`, `z-index: 10`.
    *   **Main Content:** `padding: 100px 24px 24px 100px;` to create space for the fixed `TopBar` and `LeftNav`.

---

### 1. DashboardBackground

*   **Purpose:** Provides the full-screen background color and contains the large 3D mascot.
*   **Visual Description:** A solid light gray background covering the entire viewport. A large, white, clawed robot mascot is fixed to the bottom-left corner.
*   **Tailwind CSS Specs:**
    *   Container: `w-screen h-screen fixed inset-0 -z-10 bg-[#e1e1e1]`
    *   Mascot Image: `absolute bottom-0 left-0 w-[380px] h-auto z-0` (adjust width as needed)
*   **TypeScript Props:**
    ```typescript
    interface DashboardBackgroundProps {
      mascotSrc: string; // URL for the mascot image
      children: React.ReactNode;
    }
    ```
*   **Dark Mode:**
    *   Container: `dark:bg-[#1A1A1A]`

---

### 2. TopBar

*   **Purpose:** Displays the application title and primary user controls (settings, profile).
*   **Visual Description:** A full-width horizontal bar at the top of the screen. It contains the "OpenClaw Mission Control" title on the left, and a settings `IconButton` and `ProfilePill` on the right.
*   **Tailwind CSS Specs:**
    *   Container: `fixed top-6 left-6 right-6 h-12 flex justify-between items-center z-10` (using padding on the main content area to avoid overlap)
    *   Title: `flex items-center gap-x-2 text-2xl text-[#111111]`
        *   "OpenClaw": `font-audiowide font-normal text-[32px]`
        *   "Mission Control": `font-audiowide font-normal text-[32px]`
    *   Right Controls: `flex items-center gap-x-2`
*   **TypeScript Props:**
    ```typescript
    interface TopBarProps {
      userName: string;
      userAvatarUrl: string;
      userEmoji: string;
    }
    ```
*   **Dark Mode:**
    *   Title: `dark:text-[#e1e1e1]`

---

### 3. LeftNav

*   **Purpose:** Provides primary navigation or mode-switching actions.
*   **Visual Description:** A vertical stack of three floating `IconButton`s, vertically centered on the left edge of the screen.
*   **Tailwind CSS Specs:**
    *   Container: `fixed left-6 top-1/2 -translate-y-1/2 flex flex-col gap-y-4 z-10`
*   **TypeScript Props:**
    ```typescript
    interface LeftNavProps {
      // Assuming icons are passed as components
      actions: {
        icon: React.ComponentType<{ className?: string }>;
        onClick: () => void;
        ariaLabel: string;
      }[];
    }
    ```
*   **Dark Mode:** The `IconButton`s will handle their own dark mode variants.

---

### 4. GlassCard

*   **Purpose:** A base component for all dashboard cards, providing the core glassmorphism style.
*   **Visual Description:** A semi-transparent white card with rounded corners, a subtle border, a background blur, and a soft drop shadow.
*   **Tailwind CSS Specs:**
    *   Container: `bg-white/50 backdrop-blur-[20px] rounded-xl p-6 border border-white/50 shadow-[0_0_24px_rgba(0,0,0,0.04)]`
*   **TypeScript Props:**
    ```typescript
    interface GlassCardProps {
      children: React.ReactNode;
      className?: string; // For additional layout classes
    }
    ```
*   **Dark Mode:**
    *   Container: `dark:bg-[#2D2D2D]/50 dark:border-[#444444]/50`

---

### 5. CardHeader

*   **Purpose:** A standardized header for `GlassCard` components.
*   **Visual Description:** A flexible row containing an icon, a bold title, and an optional action button on the far right.
*   **Tailwind CSS Specs:**
    *   Container: `flex justify-between items-center w-full mb-4`
    *   Title Group: `flex items-center gap-x-3`
    *   Icon: `w-6 h-6 text-[#111111]`
    *   Title Text: `font-inter font-semibold text-base text-[#111111]` (16px)
*   **TypeScript Props:**
    ```typescript
    interface CardHeaderProps {
      icon: React.ComponentType<{ className?: string }>;
      title: string;
      actionButton?: React.ReactNode; // e.g., an <IconButton />
    }
    ```
*   **Dark Mode:**
    *   Icon: `dark:text-[#e1e1e1]`
    *   Title Text: `dark:text-[#ffffff]`

---

### 6. StatusCard

*   **Purpose:** Displays the primary agent's identity, status, and configuration.
*   **Visual Description:** A specialized `GlassCard` with a vertical layout. It starts with an avatar, name, and status dot. Below are sections for Channels, Skills, and Heartbeats, followed by a recessed `SystemInfoPanel`.
*   **Tailwind CSS Specs:**
    *   Container (extends `GlassCard`): `flex flex-col gap-y-6`
    *   Agent Info: `flex items-center gap-x-3`
    *   Avatar: `w-12 h-12 rounded-full`
    *   Name & Status: `flex flex-col`
        *   Name: `font-inter font-bold text-lg text-[#111111]` (18px)
        *   Status: `flex items-center gap-x-2 font-geist-mono font-semibold text-xs text-[#cbcbcb]` (12px)
*   **TypeScript Props:**
    ```typescript
    // This is a composite component, props would be complex
    interface StatusCardProps {
      agent: {
        name: string;
        avatarUrl: string;
        isOnline: boolean;
        channels: number;
        skills: { total: number; workspace: number };
        heartbeats: number;
        model: string;
        port: number;
        concurrency: { current: number; max: number };
        uptime: string;
        version: string;
      };
    }
    ```
*   **Dark Mode:**
    *   Name: `dark:text-[#ffffff]`
    *   Status Text: `dark:text-[#cbcbcb]`

---

### 7. StatusSection

*   **Purpose:** A single, expandable row within the `StatusCard`.
*   **Visual Description:** A row with a gray label (e.g., "CHANNELS"), an icon and value on the right, and an expand button.
*   **Tailwind CSS Specs:**
    *   Container: `flex justify-between items-center`
    *   Label: `font-geist-mono font-black text-[10px] text-[#cbcbcb] tracking-wider`
    *   Value Group: `flex items-center gap-x-3`
    *   Icon: `w-5 h-5 text-[#111111]`
    *   Value Text: `font-geist-mono font-bold text-sm text-[#111111]` (14px)
*   **TypeScript Props:**
    ```typescript
    interface StatusSectionProps {
      label: string;
      icon: React.ComponentType<{ className?: string }>;
      value: string;
      onExpand: () => void;
    }
    ```
*   **Dark Mode:**
    *   Icon: `dark:text-[#e1e1e1]`
    *   Value Text: `dark:text-[#ffffff]`

---

### 8. SystemInfoPanel

*   **Purpose:** Displays low-level system information in a visually distinct, recessed panel.
*   **Visual Description:** A light gray, rounded rectangle at the bottom of the `StatusCard`. It contains vertically stacked rows of technical data, each with an icon and text.
*   **Tailwind CSS Specs:**
    *   Container: `bg-[#e1e1e1] rounded-lg p-3 flex flex-col gap-y-2`
    *   Row: `flex items-center gap-x-3`
    *   Icon: `w-4 h-4 text-[#111111]`
    *   Text: `font-geist-mono font-semibold text-xs text-[#111111]` (12px)
*   **TypeScript Props:**
    ```typescript
    interface SystemInfoPanelProps {
      info: {
        icon: React.ComponentType<{ className?: string }>;
        text: string;
      }[];
    }
    ```
*   **Dark Mode:**
    *   Container: `dark:bg-[#111111]`
    *   Icon: `dark:text-[#cbcbcb]`
    *   Text: `dark:text-[#cbcbcb]`

---

### 9. BrainFileRow

*   **Purpose:** Displays a configuration file with metadata and an edit action.
*   **Visual Description:** A row with an icon, a primary title, secondary metadata text below it, and an edit `IconButton` on the right.
*   **Tailwind CSS Specs:**
    *   Container: `flex justify-between items-center py-2`
    *   Info Group: `flex items-center gap-x-4`
    *   Icon: `w-6 h-6 text-[#111111]`
    *   Text Group: `flex flex-col`
        *   Title: `font-inter font-semibold text-sm text-[#111111]` (14px)
        *   Metadata: `font-geist-mono font-medium text-xs text-[#cbcbcb]` (12px)
*   **TypeScript Props:**
    ```typescript
    interface BrainFileRowProps {
      icon: React.ComponentType<{ className?: string }>;
      title: string;
      fileName: string;
      fileSize: string;
      lastModified: string;
      onEdit: () => void;
    }
    ```
*   **Dark Mode:**
    *   Icon: `dark:text-[#e1e1e1]`
    *   Title: `dark:text-[#ffffff]`
    *   Metadata: `dark:text-[#cbcbcb]`

---

### 10. MemoryEntry

*   **Purpose:** Displays the long-term memory file, functionally identical to `BrainFileRow`.
*   **Visual Description:** Identical to `BrainFileRow`. This component would reuse the `BrainFileRow` component logic.
*   **Tailwind CSS Specs:** (Same as `BrainFileRow`)
*   **TypeScript Props:** (Same as `BrainFileRow`)
*   **Dark Mode:** (Same as `BrainFileRow`)

---

### 11. EpisodeRow

*   **Purpose:** Displays a truncated summary of a memory episode.
*   **Visual Description:** A row containing a dark square thumbnail with a "TODAY" badge, a title and truncated description, and an expand `IconButton`.
*   **Tailwind CSS Specs:**
    *   Container: `flex justify-between items-center py-2`
    *   Content Group: `flex items-center gap-x-4`
    *   Thumbnail: `relative w-10 h-10 bg-[#111111] rounded-lg`
    *   Badge: `absolute top-1 left-1 bg-[#111111] text-white font-geist-mono font-black text-[8px] px-1 py-0.5 rounded-md border border-white/20`
    *   Text Group: `flex flex-col`
        *   Title: `font-inter font-semibold text-sm text-[#111111]` (14px)
        *   Description: `font-inter font-normal text-xs text-[#cbcbcb]` (12px)
*   **TypeScript Props:**
    ```typescript
    interface EpisodeRowProps {
      title: string;
      contentSnippet: string;
      isToday: boolean;
      onExpand: () => void;
    }
    ```
*   **Dark Mode:**
    *   Thumbnail: `dark:bg-[#020101]` (or keep as is)
    *   Title: `dark:text-[#ffffff]`
    *   Description: `dark:text-[#cbcbcb]`

---

### 12. IconButton

*   **Purpose:** A small, generic, square button for actions like expand, edit, settings.
*   **Visual Description:** A small, light gray, rounded square containing a centered icon.
*   **Tailwind CSS Specs:**
    *   Button: `w-8 h-8 flex items-center justify-center bg-[#e1e1e1] rounded-lg hover:bg-[#d1d1d1] transition-colors`
    *   Icon: `w-4 h-4 text-[#111111]`
*   **TypeScript Props:**
    ```typescript
    interface IconButtonProps {
      icon: React.ComponentType<{ className?: string }>;
      onClick: () => void;
      ariaLabel: string;
    }
    ```
*   **Dark Mode:**
    *   Button: `dark:bg-[#2D2D2D] dark:hover:bg-[#444444]`
    *   Icon: `dark:text-[#e1e1e1]`

---

### 13. ProfilePill

*   **Purpose:** A dropdown trigger for user profile and account actions.
*   **Visual Description:** A highly-rounded pill-shaped button containing a lobster emoji, the user's name, their avatar, and a chevron-down icon.
*   **Tailwind CSS Specs:**
    *   Container: `flex items-center gap-x-2 bg-[#e1e1e1] pl-3 pr-2 py-1.5 rounded-full cursor-pointer hover:bg-[#d1d1d1] transition-colors`
    *   Name: `font-inter font-semibold text-sm text-[#111111]` (14px)
    *   Avatar: `w-6 h-6 rounded-full`
    *   Chevron Icon: `w-4 h-4 text-[#111111]`
*   **TypeScript Props:**
    ```typescript
    interface ProfilePillProps {
      name: string;
      avatarUrl: string;
      emoji: string; // e.g., '🦞'
      onClick: () => void;
    }
    ```
*   **Dark Mode:**
    *   Container: `dark:bg-[#2D2D2D] dark:hover:bg-[#444444]`
    *   Name: `dark:text-[#e1e1e1]`
    *   Chevron Icon: `dark:text-[#e1e1e1]`

---

### 14. StatusDot

*   **Purpose:** A small visual indicator for online/offline status.
*   **Visual Description:** A small, solid-colored circle.
*   **Tailwind CSS Specs:**
    *   Container: `w-2 h-2 rounded-full`
    *   Online: `bg-[#00a955]`
    *   Offline: `bg-[#e90303]` (inferred from tokens)
*   **TypeScript Props:**
    ```typescript
    interface StatusDotProps {
      isOnline: boolean;
    }
    ```
*   **Dark Mode:** No changes needed; color is semantic.