# Roadmap: ax-test-social

## Overview

**Phases:** 4
**Requirements:** 44
**Coverage:** 100%

## Phase 1: Server Foundation + Users + Social Graph

**Goal:** Set up Express server with Vercel deployment config, in-memory store with seed data, user profile CRUD, follow/unfollow system, and user search.

**Requirements:** USER-01, USER-02, USER-03, USER-04, SOCL-01, SOCL-02, SOCL-03, SOCL-04

**Success Criteria:**
1. Express server starts and responds to `/api/health` with 200
2. 5 seeded users are available via `/api/users`
3. User can create/read profiles with username, display_name, bio, avatar_url
4. User can follow/unfollow and see follower/following counts update
5. User search by username/display_name returns matching results

---

## Phase 2: Posts + Feed System

**Goal:** Implement post CRUD with text and optional images, personalized feed from followed users, explore page with all posts, trending posts, and load-more pagination.

**Requirements:** POST-01, POST-02, POST-03, POST-04, POST-05, POST-06, FEED-01, FEED-02, FEED-03, FEED-04

**Success Criteria:**
1. User can create, edit, and delete posts with text and optional image_url
2. 20 seeded posts are available with varied content
3. Feed returns only posts from followed users in reverse chronological order
4. Explore returns all posts; trending returns most-liked in 24h window
5. Load-more pagination returns next batch of posts

---

## Phase 3: Engagement + Discovery + Notifications + Bookmarks

**Goal:** Add likes, comments, hashtag extraction/search, notification system, and bookmarks.

**Requirements:** ENGM-01, ENGM-02, ENGM-03, ENGM-04, ENGM-05, ENGM-06, ENGM-07, DISC-01, DISC-02, DISC-03, DISC-04, NOTF-01, NOTF-02, NOTF-03, NOTF-04, NOTF-05, BKMK-01, BKMK-02, BKMK-03

**Success Criteria:**
1. User can like/unlike posts and see like count update
2. User can add/delete comments and see comment count update
3. Hashtags are extracted from post text and searchable
4. Notifications are created for follows, likes, and comments with unread count
5. User can bookmark/unbookmark posts and view bookmarks list

---

## Phase 4: Frontend UI with Premium Polish

**Goal:** Build the complete frontend with polished UI: card layout, animations, responsive design, skeleton loading, toast notifications, and all interactive features.

**Requirements:** UIPX-01, UIPX-02, UIPX-03, UIPX-04, UIPX-05, UIPX-06, UIPX-07, UIPX-08, UIPX-09, UIPX-10, UIPX-11, UIPX-12, UIPX-13

**Success Criteria:**
1. Feed view displays posts in cards with rounded corners, shadows, and indigo accent
2. Like button animates with heart fill + scale bounce
3. Comments slide open with CSS animation
4. FAB compose button opens post creation modal
5. Profile page shows cover area, avatar with gradient border, and stats
6. Skeleton loading shows while content loads, toast notifications slide from top
7. Responsive: single column on mobile, max-width centered on desktop

---

## Dependency Graph

```
Phase 1 (Server + Users + Social)
    → Phase 2 (Posts + Feed)
        → Phase 3 (Engagement + Discovery + Notifications + Bookmarks)
            → Phase 4 (Frontend UI)
```

All phases are sequential — each builds on the previous.
