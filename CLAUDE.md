# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A React PWA (Progressive Web App) for running operational playbooks — think incident response checklists with task assignment. It's deployed as a Docker container (nginx serving a static Vite build) on CasaOS, exposed on port 3210.

## Commands

```bash
# Local development
npm install
npm run dev        # Vite dev server (hot reload)
npm run build      # Build to dist/
npm run preview    # Preview the production build locally

# Deploy (on the CasaOS server)
docker compose up -d --build   # Build and start container
docker compose down            # Stop
```

No test suite exists in this project.

## Architecture

The entire frontend lives in a single file: `src/PlaybookApp.jsx`. There is no routing library, no state management library, no CSS files — everything is co-located.

**Key patterns:**

- **StorageService** (top of `PlaybookApp.jsx`): async abstraction over `localStorage` with keys `playbook:templates`, `playbook:runs`, `playbook:members`. The comment says "Swap for Supabase/Firebase later."
- **State** lives entirely in the root `PlaybookApp` component. Children receive data and callbacks as props — no context, no shared state.
- **Styles** are injected via a `<style>` tag from the `STYLES` string constant. CSS custom properties (variables) defined in `:root` control the dark theme. Mobile layout switches at `768px` using media queries: sidebar hidden, bottom tab bar shown, FAB shown.
- **Views** are plain components (`TemplatesView`, `RunsView`, `RunDetailView`) rendered conditionally by a `view` state string (`"templates"`, `"runs"`, `"finished"`, `"members"`).
- **Modals** (`TemplateEditorModal`, `StartRunModal`, `MemberModal`) are rendered at the root level and controlled by modal state objects.
- **Icons** are inline SVG paths rendered by the `Icon` component — no icon library dependency.
- **`uid()`** generates IDs from `Date.now()` + `Math.random()`.

**Data shapes:**

```js
// Template task
{ id, title, assignee, type: "manual"|"http",
  automation?: { method, url, headers: [{key,value}], body } }

// Template
{ id, name, description, checklists: [{ id, name, tasks: [TaskTemplate] }] }

// Run task (extends template task)
{ ...TaskTemplate, done: false, lastResult: null|{ ok, status, statusText, body, timestamp, error } }

// Run
{ id, templateId, templateName, name, status: "in-progress"|"finished", startedAt, checklists: [...] }
```

Run status auto-updates to `"finished"` when all tasks are checked. HTTP tasks auto-check on successful (2xx) execution.

## Deployment

The Dockerfile is a two-stage build: Node 20 Alpine builds the Vite app, nginx Alpine serves `dist/`. `nginx.conf` uses `try_files` for SPA routing and sets 30-day cache headers on static assets.

PWA support: `public/manifest.json` + `public/sw.js` (network-first caching strategy). Icons at `public/icon-192.png` and `public/icon-512.png` are optional but needed for PWA install prompts.

To change the port, edit the `ports` mapping in `docker-compose.yml`.
