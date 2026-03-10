# Research Summary: Social Media Feed App

## Stack Decision
- **Backend:** Node.js 20 + Express.js 4.x
- **Frontend:** Vanilla HTML/CSS/JS (no framework, no build step)
- **Storage:** In-memory JavaScript objects with seed data
- **Deployment:** Vercel serverless via `api/index.js`
- **Testing:** Node.js built-in test runner (`node --test`)

## Table Stakes Features
- User profiles (username, display name, bio, avatar)
- Post CRUD (text + optional image URL)
- Follow/unfollow with counts
- Personalized feed (followed users, reverse chronological)
- Like/unlike with counts
- Comments with counts
- Relative timestamps

## Differentiators in v1
- Explore page + trending (most liked in 24h)
- Hashtag extraction and search
- User search
- Bookmarks (save for later)
- Notifications (in-memory queue with badge)
- Premium UI polish: skeleton loading, toast notifications, FAB, heart animation, sliding comments

## Key Architectural Decisions
1. Single Express app serving both API and static frontend
2. All API routes under `/api/` with full path matching (Vercel requirement)
3. In-memory store seeded at module load time (survives cold starts)
4. Frontend uses fetch() for all API calls, DOM manipulation for rendering
5. CSS-only animations (transform/opacity) for performance

## Top Risks
1. **Vercel routing** — Express must see full `/api/...` paths
2. **Cold start data loss** — Seed on every import, not conditional
3. **CSS animation jank** — Only animate transform/opacity
4. **Notification memory** — Cap queue size per user
