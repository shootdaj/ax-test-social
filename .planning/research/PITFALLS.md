# Pitfalls Research: Social Media Feed App

## Critical Pitfalls

### 1. Vercel Routing Mismatch
**Warning signs:** 404s on deployed API endpoints
**Prevention:** Express routes MUST use full paths (e.g., `/api/users`, not `/users`). Vercel does NOT strip path prefixes — the `vercel.json` route `"/api/(.*)"` passes the full URL `/api/users` to Express. Configure `vercel.json` routes correctly from day one.
**Phase:** Phase 1 (server setup)

### 2. In-Memory State Reset on Cold Start
**Warning signs:** Data disappears after Vercel cold start
**Prevention:** Seed data must be initialized on every server start, not just first boot. The `store.js` module should seed data at import time. Vercel serverless functions cold-start frequently.
**Phase:** Phase 1 (store setup)

### 3. Frontend Fetch Without Error Handling
**Warning signs:** Silent failures, broken UI state
**Prevention:** Every `fetch()` call must handle errors and show user-friendly feedback (toast notifications). Network errors should not leave the UI in a broken state.
**Phase:** Phase 5 (frontend)

### 4. CSS Animation Performance
**Warning signs:** Janky animations, layout thrashing
**Prevention:** Only animate `transform` and `opacity` — never animate `width`, `height`, `top`, `left`, or `margin`. Use `will-change` sparingly. Use CSS transitions for simple state changes, keyframe animations for complex sequences.
**Phase:** Phase 5 (frontend)

### 5. Missing CORS Headers
**Warning signs:** Frontend can't reach API in development
**Prevention:** Add CORS middleware to Express. In production on Vercel, same-origin requests work, but development (separate ports) needs CORS.
**Phase:** Phase 1 (server setup)

### 6. Feed Query Performance with In-Memory Store
**Warning signs:** Slow feed generation
**Prevention:** For in-memory storage with small dataset (20 posts), simple array filtering is fine. Don't over-optimize. Keep feed generation straightforward: filter posts by followed users, sort by date, slice for pagination.
**Phase:** Phase 3 (feed)

### 7. Image Aspect Ratio Issues
**Warning signs:** Stretched or cropped images
**Prevention:** Use `object-fit: cover` with fixed aspect ratio containers (`aspect-ratio: 16/9` or similar). Never set both width and height on images without object-fit.
**Phase:** Phase 5 (frontend)

### 8. Notification Queue Memory Leak
**Warning signs:** Memory grows unbounded
**Prevention:** Cap notification queue per user (e.g., max 50 notifications). Trim oldest when adding new ones.
**Phase:** Phase 4 (notifications)
