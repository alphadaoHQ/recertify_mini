# Recertify Mini

**Recertify Mini** is a Telegram Mini App for blockchain education. Users connect a TON wallet, complete interactive learning modules (quizzes), claim XP-based task rewards, earn NFT artifact badges, and compete on a global leaderboard. Data is persisted to Supabase with a localStorage fallback for offline use.

Built with React 18, Vite 6, Tailwind CSS v4, and deployed as a mobile-first single-page application.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Features](#features)
- [Data Flow](#data-flow)
- [Database Schema](#database-schema)
- [Environment Setup](#environment-setup)
- [Running Locally](#running-locally)
- [Deployment](#deployment)
- [Admin Panel](#admin-panel)
- [Contributing](#contributing)

---

## Project Overview

Recertify Mini gamifies blockchain learning inside Telegram. The core loop:

1. **Learn** — Read mission briefings about blockchain protocols (Ethereum, Polygon, Chainlink, Uniswap)
2. **Quiz** — Answer a checkpoint question to prove understanding
3. **Earn** — Gain XP and mint an NFT artifact badge on correct answers
4. **Compete** — Climb the leaderboard and unlock whitelist eligibility
5. **Complete tasks** — Follow social channels, write reviews, earn bonus XP
6. **Unlock ambassador status** — Complete the special quest for a limited-edition NFT

The app is designed for the TON ecosystem (wallet connection via TON Connect) and works both inside Telegram and in any modern browser.

---

## Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Framework** | React | 18.3 | UI components and state management |
| **Bundler** | Vite | 6.0 | Fast dev server, ESM-native build |
| **Styling** | Tailwind CSS | 4.2 | Utility-first CSS with custom design tokens |
| **Database** | Supabase | 2.x | PostgreSQL persistence via REST API |
| **Wallet** | TON Connect | 2.4 | TON blockchain wallet authentication |
| **Telegram** | @twa-dev/sdk | 8.0 | Telegram WebApp SDK integration |
| **Icons** | lucide-react | 1.8 | Consistent icon set across all UI |
| **Routing** | react-router-dom | 6.28 | Hash-based client-side routing |
| **Fonts** | Inter + Manrope | — | Google Fonts (body + display) |

---

## Architecture

```text
recertify-mini/
├── index.html                # Entry HTML with theme initialization script
├── vite.config.js            # Vite config (React + Tailwind plugins)
├── package.json
├── .env.example              # Required environment variables
├── supabase/
│   └── schema.sql            # Full database schema with RLS policies
├── public/
│   └── tonconnect-manifest.json  # TON Connect app manifest
└── src/
    ├── main.jsx              # React root — HashRouter + TonConnectUIProvider
    ├── App.jsx               # Route definitions + app shell orchestration
    ├── styles.css            # Tailwind v4 imports + custom design tokens
    ├── components/
    │   ├── AppShell.jsx      # Mobile shell wrapper (TopBar + BottomNav + content)
    │   ├── TopBar.jsx        # Header bar with wallet button + theme toggle
    │   ├── BottomNav.jsx     # Tab navigation bar (Learning, Tasks, Ranks, Profile)
    │   ├── Icon.jsx          # Unified icon component wrapping lucide-react
    │   └── ProgressRing.jsx  # SVG circular progress indicator
    ├── pages/
    │   ├── LearningHubPage.jsx   # Course module grid with progress cards
    │   ├── CourseModulePage.jsx   # Individual module view (mission + quiz)
    │   ├── TasksPage.jsx         # Daily tasks + special quest
    │   ├── RanksPage.jsx         # Leaderboard + whitelist status
    │   ├── ProfilePage.jsx       # User profile, NFT collection, stats
    │   └── admin/
    │       ├── AdminPage.jsx     # Admin entry point (auth gate + tab router)
    │       ├── AdminLogin.jsx    # Admin login form (email + password)
    │       ├── AdminLayout.jsx   # Desktop sidebar layout
    │       ├── DashboardTab.jsx  # Summary statistics cards
    │       ├── CoursesTab.jsx    # CRUD table for learning modules
    │       ├── TasksTab.jsx      # CRUD table for tasks
    │       ├── UsersTab.jsx      # User management with search + XP adjustment
    │       └── WhitelistTab.jsx  # Whitelist viewer with CSV export
    ├── hooks/
    │   ├── useAppData.js     # Main app state — wallet, progress, leaderboard
    │   ├── useAdminData.js   # Admin panel state — CRUD operations + auth
    │   └── useTheme.js       # Dark/light mode toggle + localStorage persistence
    ├── lib/
    │   ├── appData.js        # Core data layer — Supabase read/write, view model
    │   ├── adminData.js      # Admin API — course/task CRUD, user management, CSV
    │   ├── supabase.js       # Supabase client initialization
    │   ├── localState.js     # localStorage fallback for offline wallet state
    │   ├── wallet.js         # TON wallet address formatting utilities
    │   └── telegram.js       # Telegram WebApp SDK initialization
    └── data/
        └── mockData.js       # Seed data (default modules, tasks, leaderboard)
```

### Layer Responsibilities

| Layer | Description |
|---|---|
| **Pages** | Full-screen route components. Each page receives all data as props from `App.jsx`. |
| **Components** | Reusable UI primitives (shell, navigation, icons, progress rings). |
| **Hooks** | State management bridges. `useAppData` owns the entire app lifecycle; `useAdminData` owns the admin panel lifecycle. |
| **Lib** | Pure data access functions. No React dependencies. `appData.js` handles Supabase or localStorage persistence; `adminData.js` handles admin CRUD. |
| **Data** | Seed/default data used as fallback when Supabase tables are empty. |

---

## Features

### Learning Hub
- Grid of blockchain course modules with icons, titles, and progress badges
- Each card shows completion status (Not Started → In Progress → Complete)
- Recent NFT mint banner at the top
- Dynamic content loaded from Supabase `courses` table (admin-managed)

### Course Module Detail
- Mission briefing with multi-paragraph copy
- Step counter (Step 1 of 5)
- Quiz checkpoint with 3 answer options
- Correct answer → XP reward + NFT artifact minted
- Incorrect answer → progress saved, retry allowed
- Award already claimed → prevented from double-claiming

### Tasks
- List of social engagement tasks (Follow on X, Join Discord, Write a Review)
- Each task has an XP reward value and a status label
- One-click claim with instant XP credit
- Tasks loaded from Supabase `tasks` table (admin-managed)

### Special Quest (Ambassador)
- Unlockable bonus quest requiring 2 completed tasks + 1 completed module
- 500 XP reward + limited-edition NFT
- Gated by progress — UI shows requirements and current progress

### Ranks & Leaderboard
- Top 6 users displayed with rank badges (1ST, 2ND, 3RD…)
- Gold/silver/bronze accent colors for top 3
- Current user's rank highlighted
- Whitelist eligibility card with progress bars

### Profile
- Avatar (DiceBear identicon based on wallet address)
- Level, title, XP bar with rank progression
- Username claim (one-time, unique, persisted to Supabase)
- NFT collection gallery (minted artifacts + locked placeholders)
- Stats breakdown (modules completed, tasks claimed)
- Whitelist status card

### Wallet Integration
- TON Connect wallet connection via modal
- Wallet address displayed in header (truncated)
- Profile and progress scoped to wallet address
- Disconnect wallet from header menu

### Dark Mode
- System preference detection on initial load
- Manual toggle in top bar
- Preference persisted in `localStorage`
- Full dark theme using Tailwind `dark:` variants

### Whitelist System
- Automatic eligibility calculated from progress (≥2 tasks + ≥1 module)
- Eligible users written to `whitelist` table in Supabase
- Rankings based on total XP
- Exportable as CSV from admin panel

---

## Data Flow

```text
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Telegram SDK  │────►│     App.jsx      │────►│   useAppData()  │
│  (user context) │     │  (route + shell) │     │   (state hook)  │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                                          ┌───────────────┼───────────────┐
                                          ▼               ▼               ▼
                                   ┌─────────────┐ ┌────────────┐ ┌──────────────┐
                                   │  appData.js │ │ adminData  │ │  mockData.js │
                                   │ (Supabase)  │ │ (courses/  │ │  (fallback)  │
                                   │             │ │  tasks DB) │ │              │
                                   └──────┬──────┘ └─────┬──────┘ └──────────────┘
                                          │              │
                                          ▼              ▼
                                   ┌──────────────────────────┐
                                   │       Supabase DB        │
                                   │  (profiles, progress,    │
                                   │   rewards, whitelist,    │
                                   │   courses, tasks)        │
                                   └──────────────────────────┘
```

### Lifecycle

1. **Boot** — `main.jsx` renders `App` inside `HashRouter` and `TonConnectUIProvider`
2. **Theme** — Inline `<script>` in `index.html` reads localStorage and sets `.dark` class before React mounts (prevents flash)
3. **Telegram** — `useAppData` calls `initializeTelegramApp()` to signal readiness and expand
4. **Dynamic content** — `useAppData` loads active courses and tasks from Supabase `courses`/`tasks` tables (admin-managed); falls back to `seedData` if tables are empty
5. **Wallet connect** — User opens TON Connect modal; on success, `useTonAddress()` returns the address
6. **State load** — `loadWalletState(address)` reads profile, course progress, task claims, and rewards from Supabase (or localStorage fallback)
7. **View model** — `createAppViewModel()` assembles all display data from raw state + dynamic modules/tasks
8. **User actions** — `completeModule()`, `claimTask()`, `claimSpecialQuest()` mutate state → write to Supabase → refresh leaderboard and whitelist
9. **Persistence** — Every state mutation triggers `saveWalletState()` which upserts all related tables

### Supabase vs Local Fallback

| Condition | Behavior |
|---|---|
| `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` present | Full Supabase persistence, leaderboard from DB |
| Environment variables missing | localStorage per wallet address, seed leaderboard |

---

## Database Schema

The full schema is in [`supabase/schema.sql`](supabase/schema.sql). All tables use RLS with open anon policies (the app uses wallet addresses, not Supabase Auth).

### Core Tables

#### `profiles`
| Column | Type | Description |
|---|---|---|
| `wallet_address` | text PK | TON wallet address |
| `name` | text | Display name (from Telegram or wallet) |
| `username` | text UNIQUE | User-chosen username (set once) |
| `avatar` | text | Avatar URL (DiceBear identicon) |
| `xp` | integer | Total experience points |
| `weekly_xp` | integer | XP earned this week |
| `streak_xp` | integer | Current streak XP |
| `level` | integer | Computed level from XP |
| `title` | text | Rank title (New Explorer → Master) |
| `next_rank` | text | Next rank to achieve |
| `xp_to_next_rank` | integer | XP remaining to next rank |
| `whitelist_eligible` | boolean | Auto-computed eligibility flag |

#### `course_progress`
| Column | Type | Description |
|---|---|---|
| `wallet_address` | text FK | References profiles |
| `module_id` | text | Course module identifier |
| `completed` | boolean | Whether the quiz was passed |
| `reward_claimed` | boolean | Whether the NFT/XP reward was claimed |
| `selected_answer` | text | Last selected answer ID |
| `xp_earned` | integer | XP awarded for completion |
| `completed_at` | timestamptz | Completion timestamp |

#### `task_claims`
| Column | Type | Description |
|---|---|---|
| `wallet_address` | text FK | References profiles |
| `task_id` | text | Task identifier |
| `claimed` | boolean | Whether the task was claimed |
| `xp_earned` | integer | XP awarded |
| `claimed_at` | timestamptz | Claim timestamp |

#### `reward_claims`
| Column | Type | Description |
|---|---|---|
| `wallet_address` | text FK | References profiles |
| `reward_id` | text | NFT reward identifier |
| `reward_type` | text | "module" or "special_quest" |
| `title` | text | NFT title |
| `rarity` | text | Rarity label |
| `image` | text | NFT image URL |
| `module_id` | text | Source module (null for special quest) |
| `xp_earned` | integer | XP awarded with this reward |

#### `whitelist`
| Column | Type | Description |
|---|---|---|
| `wallet_address` | text PK FK | References profiles |
| `username` | text | Username at time of eligibility |
| `rank` | integer | Leaderboard rank |
| `total_xp` | integer | Total XP at time of eligibility |
| `tasks_completed` | integer | Number of tasks completed |
| `modules_completed` | integer | Number of modules completed |
| `status` | text | "eligible" (default) |

### Admin-Managed Content Tables

#### `courses`
| Column | Type | Description |
|---|---|---|
| `id` | text PK | URL slug (e.g., "ethereum-core") |
| `title` | text | Display title |
| `subtitle` | text | Display subtitle |
| `icon` | text | Icon name from lucide-react |
| `image` | text | Cover image URL |
| `mission_title` | text | Mission briefing title |
| `mission_label` | text | Label (default: "Project Mission") |
| `mission_copy` | jsonb | Array of paragraph strings |
| `reward_xp` | integer | XP reward for completion |
| `nft_reward_id` | text | NFT artifact identifier |
| `nft_reward_title` | text | NFT display title |
| `nft_reward_rarity` | text | NFT rarity label |
| `nft_reward_image` | text | NFT image URL |
| `question` | text | Quiz question |
| `answers` | jsonb | Array of `{id, text, correct}` objects |
| `sort_order` | integer | Display order |
| `is_active` | boolean | Whether shown to users |

#### `tasks`
| Column | Type | Description |
|---|---|---|
| `id` | text PK | URL slug (e.g., "follow-x") |
| `title` | text | Display title |
| `description` | text | Task description |
| `reward_xp` | integer | XP reward for completion |
| `reward_label` | text | Display label (e.g., "+50 XP") |
| `status` | text | Status label (e.g., "Instant") |
| `icon` | text | Icon name from lucide-react |
| `sort_order` | integer | Display order |
| `is_active` | boolean | Whether shown to users |

---

## Environment Setup

### 1. Supabase Project

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the full contents of [`supabase/schema.sql`](supabase/schema.sql)
3. Copy your **Project URL** and **anon public key** from **Settings → API**

### 2. Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in the values:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your-anon-key
```

> **Note:** If you omit these variables, the app will still run using localStorage for persistence and seed data for content.

### 3. TON Connect Manifest

The `public/tonconnect-manifest.json` file describes the app to TON wallets. Update it with your app's URL and icon if deploying.

---

## Running Locally

### Prerequisites

- Node.js 18+ and npm
- A Supabase project (optional — app works without it)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/alphadaoHQ/recertify_mini.git
cd recertify_mini

# 2. Install dependencies
npm install

# 3. Set up environment (optional for Supabase)
cp .env.example .env
# Edit .env with your Supabase credentials

# 4. Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |

---

## Deployment

### Static Build

```bash
npm run build
```

This outputs a static site to `dist/`. Deploy to any static hosting:
- **Vercel** — auto-detects Vite; no config needed
- **Netlify** — set build command to `npm run build`, publish directory to `dist`
- **GitHub Pages** — push `dist/` to `gh-pages` branch

### Telegram Mini App Setup

1. Create a bot via [@BotFather](https://t.me/BotFather)
2. Use `/newapp` to create a Mini App linked to your bot
3. Set the Mini App URL to your deployed URL
4. Update `public/tonconnect-manifest.json` with your production URL
5. Users can now open the app inside Telegram

---

## Admin Panel

The admin panel is accessible at `#/admin` and provides full CRUD management for the app.

### Access

1. Navigate to `#/admin` in your browser
2. Sign in with configured admin credentials (set in `src/lib/adminData.js`)
3. Default credentials:
   - **Email:** `admin@recertify.io`
   - **Password:** `RecertifyAdmin2026`

> **Security Note:** Admin authentication is client-side only. Since RLS is fully open (anon key has full read/write), this is a convenience gate. For production, implement Supabase Auth with RLS policies that restrict admin operations to authenticated admin users.

### Dashboard

Summary statistics pulled from Supabase:
- Total registered users
- Active courses count
- Active tasks count
- Whitelist-eligible users
- Total XP distributed

### Courses Management

- **View** all courses in a sortable table
- **Add** new courses with full form (title, icon, image, mission copy, quiz, NFT reward, XP)
- **Edit** existing courses inline via modal
- **Delete** courses (removes from Supabase)
- **Seed Defaults** — one-click populate from built-in `seedData`

Changes made here are immediately reflected in the user-facing Learning Hub on page reload.

### Tasks Management

- **View** all tasks with title, description, XP, status, and active flag
- **Add/Edit/Delete** tasks with full form
- **Seed Defaults** — populate from built-in task data

### User Management

- **Search** users by name, username, or wallet address
- **View** user details (XP, level, title, whitelist status)
- **Adjust XP** — modify a user's XP value directly
- **Delete** user — removes profile and all cascaded data (progress, claims, rewards)

### Whitelist

- **View** all whitelist-eligible users with rank, XP, and completion stats
- **Export CSV** — download a CSV file of all whitelist entries

### Design

The admin panel uses:
- Desktop-first layout with a fixed sidebar + scrollable content area
- Dark theme (slate-950 background) matching the app's dark mode
- Glassmorphism cards and gradients from the app's design system
- Separate from the mobile app shell (no bottom nav or top bar)

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Run `npm run build` to verify compilation
5. Submit a pull request

### Design Token Reference

Custom tokens are defined in `src/styles.css` under `@theme`:

| Token | Value | Usage |
|---|---|---|
| `--color-brand-primary` | `#8127cf` | Primary purple accent |
| `--color-brand-primary-bright` | `#9c48ea` | Gradient end, hover states |
| `--color-brand-primary-soft` | `#f0dbff` | Light purple backgrounds |
| `--color-brand-secondary` | `#006e2f` | Green accent |
| `--color-brand-background` | `#fff7fe` | Page background (light) |
| `--color-brand-surface` | `#ffffff` | Card surfaces (light) |
| `--color-brand-text` | `#1f1a23` | Primary text (light) |
| `--color-brand-muted` | `#4d4354` | Secondary text |

---

## License

MIT
