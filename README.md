# Recertify Mini

Recertify Mini is now structured as a React + Vite Telegram web app shell with Tailwind CSS, wallet-linked user state, optional Supabase persistence, functional in-app tab navigation, and built-in dark mode.

The original HTML prototypes in:

- `learninghub.html`
- `CourseModule.html`
- `Taskbar.html`
- `RanksBar.html`
- `ProfileTab.html`

were translated into React pages inside `src/pages`, then unified under a single mobile-first app shell with a working bottom tab bar.

## What Changed

### Tailwind CSS conversion

The UI styling now uses Tailwind CSS utilities and theme tokens instead of the previous custom CSS-driven approach.

Design tokens are defined in `src/styles.css` using Tailwind v4 theme variables, and the components/pages are styled directly with utility classes.

### Dark mode

Dark mode is now implemented across the app.

- theme preference is stored in `localStorage`
- the `dark` class is applied on initial page load before React mounts
- the top bar includes a theme toggle
- all screens include matching dark-mode styles

### Functional tab navigation

The app now runs as a single-page experience using `react-router-dom` with hash routing:

- `#/learning`
- `#/tasks`
- `#/ranks`
- `#/profile`
- `#/learning/:moduleId`

That means the bottom navigation is now functional inside one app instead of linking to separate standalone HTML files.

### Telegram SDK integration

Telegram WebApp bootstrapping is handled in `src/lib/telegram.js`.

When opened inside Telegram:

- `WebApp.ready()` is called
- the app expands automatically
- Telegram user data can hydrate the profile header

When opened in a normal browser, the app falls back safely to local demo data.

### Supabase integration

Supabase is configured in `src/lib/supabase.js` and used by `src/hooks/useAppData.js`.

If these environment variables are present, the app persists wallet-scoped app data in Supabase:

- profile records in `profiles`
- per-module completion state in `course_progress`
- per-task claim state in `task_claims`
- minted rewards in `reward_claims`

If Supabase is not configured yet, the UI still works with local wallet-scoped fallback storage in the browser.

### Wallet-based identity

Users connect an EVM-compatible wallet from the top bar.

- the wallet address becomes the profile id
- profile XP, claimed tasks, completed modules, and rewards are scoped to that wallet
- leaderboard placement is derived from stored profile XP

## Project Structure

```text
src/
  components/
  data/
  hooks/
  lib/
  pages/
```

Key files:

- `src/App.jsx` sets up routes and the shared shell
- `src/hooks/useTheme.js` manages dark mode state and persistence
- `src/hooks/useAppData.js` manages wallet connection, profile state, rewards, tasks, and course completion
- `src/lib/appData.js` handles Supabase/local persistence and app view-model shaping
- `src/lib/wallet.js` handles wallet discovery and connection
- `src/components/BottomNav.jsx` powers the tab bar
- `src/styles.css` contains Tailwind imports and design tokens
- `supabase/schema.sql` contains the database schema for the app

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and add your Supabase values if you want live data.

3. Start the app:

```bash
npm run dev
```

4. Open the local Vite URL in your browser, or load that URL inside your Telegram Mini App setup.

## Suggested Supabase Tables

The project now includes a ready-to-run schema file:

```text
supabase/schema.sql
```

Core tables:

- `profiles`
- `course_progress`
- `task_claims`
- `reward_claims`

These cover the current project scope:

- wallet-scoped user profiles
- module completion and reward claiming
- task claiming
- NFT/reward collection
- leaderboard XP
