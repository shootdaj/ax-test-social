# ax-test-social

## What This Is

A polished social media feed application — a minimal Twitter/Instagram hybrid with beautiful typography, smooth interactions, and a premium feel. Users can create profiles, post text and images, follow each other, like and comment on posts, explore trending content, and manage notifications. Built as a Node.js/Express web app with vanilla HTML/CSS/JS frontend, in-memory storage with seed data, and deployed to Vercel.

## Core Value

Users can browse a beautiful, responsive social feed showing posts from people they follow, interact with content through likes and comments, and discover new content through explore/trending — all with a polished, animated UI that feels premium.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] User profiles with username, display name, bio, and avatar
- [ ] Follow/unfollow other users
- [ ] Create posts with text and optional image URL
- [ ] Edit and delete own posts
- [ ] Personalized feed (posts from followed users, reverse chronological)
- [ ] Explore page (all public posts)
- [ ] Trending posts (most liked in last 24h)
- [ ] Like/unlike posts with like count
- [ ] Add/delete comments on posts with comment count
- [ ] In-app notifications (new follower, new like, new comment)
- [ ] Hashtag extraction from post text and hashtag search
- [ ] User search by username/display name
- [ ] Post bookmarks (save for later)
- [ ] In-memory storage with seed data (5 users, 20 posts)
- [ ] Polished UI with light/indigo theme, card layout, animations
- [ ] Responsive design (mobile single column, desktop centered)

### Out of Scope

- Real-time WebSocket updates — in-memory polling is sufficient for v1
- Authentication/login system — users switch between seeded profiles
- File upload — image posts use URL references only
- Database persistence — in-memory storage only
- OAuth/social login — not needed for demo app
- Mobile native app — responsive web only

## Context

This is a demo/test application for dogfooding the AX project lifecycle tool. It must be a fully functional, visually impressive social feed app that demonstrates real-world complexity. The frontend must have WOW factor: CSS animations, hover states, transitions, skeleton loading, toast notifications, floating action buttons, and premium typography. Deployed to Vercel as a serverless Node.js app.

## Constraints

- **Stack**: Node.js with Express backend, vanilla HTML/CSS/JS frontend (no React/Vue)
- **Storage**: In-memory only — no database dependency
- **Deployment**: Vercel serverless (api/index.js entry point)
- **Styling**: Clean white/light-gray theme with indigo/purple accent color
- **Seed Data**: 5 users, 20 posts pre-populated on server start

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Vanilla JS frontend | Simpler deployment, no build step needed | -- Pending |
| In-memory storage | No database setup needed, fast development | -- Pending |
| Express.js backend | Widely supported on Vercel, simple API routing | -- Pending |
| Indigo/purple accent | Premium, modern feel on white background | -- Pending |

---
*Last updated: 2026-03-10 after initialization*
