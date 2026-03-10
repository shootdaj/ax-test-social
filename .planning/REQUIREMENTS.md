# Requirements: ax-test-social

**Defined:** 2026-03-10
**Core Value:** Users can browse a beautiful social feed, interact with posts through likes and comments, and discover content — all with premium UI polish.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Users

- [ ] **USER-01**: User can create a profile with username, display_name, bio, and avatar_url
- [ ] **USER-02**: User can view any user's profile page with stats (posts, followers, following)
- [ ] **USER-03**: User can search for users by username or display name
- [ ] **USER-04**: App provides 5 pre-seeded user profiles with realistic data

### Social Graph

- [ ] **SOCL-01**: User can follow another user
- [ ] **SOCL-02**: User can unfollow a followed user
- [ ] **SOCL-03**: User can view their followers list
- [ ] **SOCL-04**: User can view their following list

### Posts

- [ ] **POST-01**: User can create a text post
- [ ] **POST-02**: User can create a post with text and an image URL
- [ ] **POST-03**: User can edit their own post text
- [ ] **POST-04**: User can delete their own post
- [ ] **POST-05**: Posts display relative timestamps (e.g., "2h ago")
- [ ] **POST-06**: App provides 20 pre-seeded posts with varied content

### Feed

- [ ] **FEED-01**: User can view a personalized feed of posts from followed users in reverse chronological order
- [ ] **FEED-02**: User can view an explore page showing all public posts
- [ ] **FEED-03**: User can view trending posts (most liked in last 24 hours)
- [ ] **FEED-04**: Feed supports load-more pagination

### Engagement

- [ ] **ENGM-01**: User can like a post (heart icon fills and bounces)
- [ ] **ENGM-02**: User can unlike a previously liked post
- [ ] **ENGM-03**: Posts display like count
- [ ] **ENGM-04**: User can add a comment to a post
- [ ] **ENGM-05**: User can delete their own comment
- [ ] **ENGM-06**: Posts display comment count
- [ ] **ENGM-07**: Comment section slides open with animation

### Discovery

- [ ] **DISC-01**: Hashtags are automatically extracted from post text
- [ ] **DISC-02**: Hashtags are displayed as clickable colored pills
- [ ] **DISC-03**: User can search posts by hashtag
- [ ] **DISC-04**: User can search users by username or display name

### Notifications

- [ ] **NOTF-01**: User receives notification when someone follows them
- [ ] **NOTF-02**: User receives notification when someone likes their post
- [ ] **NOTF-03**: User receives notification when someone comments on their post
- [ ] **NOTF-04**: Notification bell shows unread count badge (red dot)
- [ ] **NOTF-05**: User can view notification list and mark as read

### Bookmarks

- [ ] **BKMK-01**: User can bookmark a post to save for later
- [ ] **BKMK-02**: User can remove a bookmark
- [ ] **BKMK-03**: User can view their bookmarked posts

### UI Polish

- [ ] **UIPX-01**: Clean white/light-gray theme with indigo/purple accent color
- [ ] **UIPX-02**: Card-based post layout with rounded corners and subtle elevation
- [ ] **UIPX-03**: Avatar circles with gradient borders
- [ ] **UIPX-04**: Like button with heart fill + scale bounce animation on click
- [ ] **UIPX-05**: Floating compose button (bottom-right FAB)
- [ ] **UIPX-06**: Smooth load-more with spinner animation
- [ ] **UIPX-07**: Profile page with cover photo area, stats display
- [ ] **UIPX-08**: Elegant typography: system font stack, proper line-height, letter-spacing
- [ ] **UIPX-09**: Image posts with preserved aspect ratio, rounded corners
- [ ] **UIPX-10**: Responsive layout: single column mobile, centered feed desktop
- [ ] **UIPX-11**: Skeleton loading placeholders while content loads
- [ ] **UIPX-12**: Toast notifications that slide in from top
- [ ] **UIPX-13**: Smooth transitions between views

## v2 Requirements

### Real-Time

- **RT-01**: Live updates via WebSocket when new posts appear
- **RT-02**: Real-time like count updates
- **RT-03**: Typing indicators in comments

### Content

- **CONT-01**: Image upload (not just URL)
- **CONT-02**: Post with multiple images (carousel)
- **CONT-03**: Rich text formatting in posts

### Social

- **SOCL-05**: Direct messaging between users
- **SOCL-06**: User can repost/share others' posts
- **SOCL-07**: Mutual follow suggestions

## Out of Scope

| Feature | Reason |
|---------|--------|
| Authentication/login | Users switch profiles via UI selector; no auth system |
| Database persistence | In-memory storage resets on restart; sufficient for demo |
| File uploads | Image posts use URLs only; no upload infrastructure |
| Email notifications | No email service; in-app only |
| Content moderation | Not needed for demo with seeded data |
| Mobile native app | Responsive web only |
| Video content | High complexity, infrastructure heavy |
| Admin dashboard | Not needed for demo |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| USER-01 | Phase 1 | Pending |
| USER-02 | Phase 1 | Pending |
| USER-03 | Phase 1 | Pending |
| USER-04 | Phase 1 | Pending |
| SOCL-01 | Phase 1 | Pending |
| SOCL-02 | Phase 1 | Pending |
| SOCL-03 | Phase 1 | Pending |
| SOCL-04 | Phase 1 | Pending |
| POST-01 | Phase 2 | Pending |
| POST-02 | Phase 2 | Pending |
| POST-03 | Phase 2 | Pending |
| POST-04 | Phase 2 | Pending |
| POST-05 | Phase 2 | Pending |
| POST-06 | Phase 2 | Pending |
| FEED-01 | Phase 2 | Pending |
| FEED-02 | Phase 2 | Pending |
| FEED-03 | Phase 2 | Pending |
| FEED-04 | Phase 2 | Pending |
| ENGM-01 | Phase 3 | Pending |
| ENGM-02 | Phase 3 | Pending |
| ENGM-03 | Phase 3 | Pending |
| ENGM-04 | Phase 3 | Pending |
| ENGM-05 | Phase 3 | Pending |
| ENGM-06 | Phase 3 | Pending |
| ENGM-07 | Phase 3 | Pending |
| DISC-01 | Phase 3 | Pending |
| DISC-02 | Phase 3 | Pending |
| DISC-03 | Phase 3 | Pending |
| DISC-04 | Phase 3 | Pending |
| NOTF-01 | Phase 3 | Pending |
| NOTF-02 | Phase 3 | Pending |
| NOTF-03 | Phase 3 | Pending |
| NOTF-04 | Phase 3 | Pending |
| NOTF-05 | Phase 3 | Pending |
| BKMK-01 | Phase 3 | Pending |
| BKMK-02 | Phase 3 | Pending |
| BKMK-03 | Phase 3 | Pending |
| UIPX-01 | Phase 4 | Pending |
| UIPX-02 | Phase 4 | Pending |
| UIPX-03 | Phase 4 | Pending |
| UIPX-04 | Phase 4 | Pending |
| UIPX-05 | Phase 4 | Pending |
| UIPX-06 | Phase 4 | Pending |
| UIPX-07 | Phase 4 | Pending |
| UIPX-08 | Phase 4 | Pending |
| UIPX-09 | Phase 4 | Pending |
| UIPX-10 | Phase 4 | Pending |
| UIPX-11 | Phase 4 | Pending |
| UIPX-12 | Phase 4 | Pending |
| UIPX-13 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 44 total
- Mapped to phases: 44
- Unmapped: 0

---
*Requirements defined: 2026-03-10*
*Last updated: 2026-03-10 after initial definition*
