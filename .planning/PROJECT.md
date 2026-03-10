# ax-test-social

## What This Is

A polished social media feed application — a minimal Twitter/Instagram hybrid with beautiful typography, smooth interactions, and a premium feel. Users can create profiles, post text and images, follow each other, like and comment on posts, explore trending content, manage notifications, and bookmark posts. Built as a Node.js/Express web app with vanilla HTML/CSS/JS frontend, in-memory storage with seed data, deployed to Vercel.

## Core Value

Users can browse a beautiful, responsive social feed showing posts from people they follow, interact with content through likes and comments, and discover new content through explore/trending — all with a polished, animated UI that feels premium.

## Current State

**Version:** v1.0 (shipped 2026-03-10)
**Stack:** Node.js 20, Express, vanilla HTML/CSS/JS
**LOC:** ~2,300 JavaScript
**Tests:** 54 (14 unit, 39 integration, 1 scenario)
**Deployment:** Vercel

## Requirements

### Validated

- User profiles with username, display name, bio, and avatar — v1.0
- Follow/unfollow other users — v1.0
- Create posts with text and optional image URL — v1.0
- Edit and delete own posts — v1.0
- Personalized feed (posts from followed users, reverse chronological) — v1.0
- Explore page (all public posts) — v1.0
- Trending posts (most liked in last 24h) — v1.0
- Like/unlike posts with like count — v1.0
- Add/delete comments on posts with comment count — v1.0
- In-app notifications (new follower, new like, new comment) — v1.0
- Hashtag extraction from post text and hashtag search — v1.0
- User search by username/display name — v1.0
- Post bookmarks (save for later) — v1.0
- In-memory storage with seed data (5 users, 20 posts) — v1.0
- Polished UI with light/indigo theme, card layout, animations — v1.0
- Responsive design (mobile single column, desktop centered) — v1.0

### Active

(None — v1.0 milestone complete)

### Out of Scope

- Real-time WebSocket updates — in-memory polling is sufficient for v1
- Authentication/login system — users switch between seeded profiles
- File upload — image posts use URL references only
- Database persistence — in-memory storage only
- OAuth/social login — not needed for demo app
- Mobile native app — responsive web only

## Context

This is a demo/test application for dogfooding the AX project lifecycle tool. It is a fully functional, visually impressive social feed app that demonstrates real-world complexity. The frontend has WOW factor: CSS animations, hover states, transitions, skeleton loading, toast notifications, floating action buttons, and premium typography. Deployed to Vercel as a serverless Node.js app.

## Constraints

- **Stack**: Node.js with Express backend, vanilla HTML/CSS/JS frontend (no React/Vue)
- **Storage**: In-memory only — no database dependency
- **Deployment**: Vercel serverless (api/index.js entry point)
- **Styling**: Clean white/light-gray theme with indigo/purple accent color
- **Seed Data**: 5 users, 20 posts pre-populated on server start

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Vanilla JS frontend | Simpler deployment, no build step needed | Good — 672 LOC, fast load |
| In-memory storage | No database setup needed, fast development | Good — instant startup, resets on cold start by design |
| Express.js backend | Widely supported on Vercel, simple API routing | Good — clean REST API, easy testing |
| Indigo/purple accent | Premium, modern feel on white background | Good — polished look |
| DiceBear avatars | No image hosting needed for user avatars | Good — consistent, unique per user |

---
*Last updated: 2026-03-10 after v1.0 milestone*
