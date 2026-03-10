# Stack Research: Social Media Feed App

## Recommended Stack (2025)

### Backend
- **Runtime:** Node.js 20 LTS
- **Framework:** Express.js 4.x — mature, widely deployed on Vercel, extensive middleware ecosystem
- **Storage:** In-memory JavaScript objects (Map/Array) — no database needed for demo
- **API Style:** RESTful JSON API

### Frontend
- **HTML/CSS/JS:** Vanilla — no framework, no build step
- **CSS:** Custom properties (variables) for theming, CSS Grid + Flexbox for layout
- **Animations:** CSS transitions + keyframe animations (no JS animation library needed)
- **Icons:** Inline SVG or CSS-based (no external icon library dependency)
- **Fonts:** System font stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', ...`)

### Deployment
- **Platform:** Vercel serverless
- **Entry point:** `api/index.js` exporting Express app
- **Config:** `vercel.json` with routes pointing to api/index.js

### Dev Tools
- **Testing:** Node.js built-in test runner (`node --test`)
- **Linting:** ESLint (optional, lightweight)
- **Package manager:** npm

## What NOT to Use
- **React/Vue/Svelte** — Overkill for a demo app, adds build complexity
- **Database (Postgres/MongoDB/SQLite)** — In-memory is sufficient, simplifies deployment
- **TypeScript** — Adds build step, unnecessary for this scope
- **Tailwind CSS** — Requires build step; custom CSS is more appropriate for polished animations
- **Socket.io** — No real-time requirement; polling or manual refresh is fine

## Confidence Levels
- Express.js on Vercel: **High** — well-documented, production-proven
- Vanilla JS frontend: **High** — no build step, fast iteration
- In-memory storage: **High** — perfect for demo/seed data scenario
- CSS animations: **High** — modern browsers fully support keyframes, transitions, transforms
