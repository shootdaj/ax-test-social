# Architecture Research: Social Media Feed App

## System Structure

### Component Diagram

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (Vanilla JS)              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│  │   Feed    │ │ Explore  │ │ Profile  │ │Compose │ │
│  │   View    │ │   View   │ │   View   │ │ Modal  │ │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └───┬────┘ │
│       └─────────────┴───────────┴────────────┘      │
│                        │ fetch()                     │
└────────────────────────┼────────────────────────────┘
                         │
┌────────────────────────┼────────────────────────────┐
│               Express.js API Server                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│  │  Users   │ │  Posts   │ │  Social  │ │ Search │ │
│  │  Routes  │ │  Routes  │ │  Routes  │ │ Routes │ │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └───┬────┘ │
│       └─────────────┴───────────┴────────────┘      │
│                        │                             │
│  ┌─────────────────────┴───────────────────────────┐│
│  │              In-Memory Data Store                ││
│  │  users{} │ posts{} │ follows{} │ notifications{}││
│  └─────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

### Major Components

1. **In-Memory Store** (`src/store.js`)
   - Central data store with Maps/Arrays
   - Seed data initialization
   - CRUD helpers for each entity type

2. **API Routes** (Express routers)
   - `src/routes/users.js` — CRUD profiles, search, follow/unfollow
   - `src/routes/posts.js` — CRUD posts, feed, explore, trending
   - `src/routes/social.js` — likes, comments, bookmarks
   - `src/routes/notifications.js` — notification queue
   - `src/routes/search.js` — hashtag search, user search

3. **Frontend** (`public/`)
   - `index.html` — SPA shell
   - `css/styles.css` — all styles, animations, responsive
   - `js/app.js` — routing, API client, DOM manipulation
   - `js/components/` — reusable UI components

### Data Flow

```
User Action → fetch() API call → Express route handler → Store mutation → JSON response → DOM update
```

### Build Order (dependencies)
1. **Phase 1:** Express server + in-memory store + seed data + Vercel config
2. **Phase 2:** User profiles + follow system + user API
3. **Phase 3:** Posts CRUD + feed + explore + trending
4. **Phase 4:** Likes + comments + bookmarks + notifications + hashtags
5. **Phase 5:** Frontend UI with all views, animations, and polish

### API Design Patterns
- RESTful endpoints under `/api/`
- JSON request/response
- Simple ID-based routing (no auth tokens needed)
- Current user passed via header or query param (user switching)
- Consistent error format: `{ error: "message" }`
