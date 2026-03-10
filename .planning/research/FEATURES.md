# Features Research: Social Media Feed App

## Table Stakes (must have — users expect these)

### User Profiles
- Username and display name
- Avatar/profile picture
- Bio/description
- Profile page with user stats (post count, followers, following)
- **Complexity:** Low

### Post Creation
- Text posts
- Image posts (URL-based)
- Edit and delete own posts
- Timestamps (relative: "2h ago")
- **Complexity:** Low

### Social Graph
- Follow/unfollow users
- Follower/following counts
- Following list visibility
- **Complexity:** Low-Medium

### Feed
- Personalized feed (posts from followed users)
- Reverse chronological ordering
- **Complexity:** Medium

### Engagement
- Like/unlike posts
- Like count display
- Comment on posts
- Comment count display
- **Complexity:** Medium

## Differentiators (competitive advantage)

### Explore/Discovery
- All public posts feed
- Trending posts (most liked recently)
- Hashtag extraction and search
- User search
- **Complexity:** Medium

### Notifications
- In-app notification system
- New follower notifications
- New like notifications
- New comment notifications
- Unread count badge
- **Complexity:** Medium

### Bookmarks
- Save posts for later
- Bookmarks list/page
- **Complexity:** Low

### UI Polish
- Skeleton loading states
- Toast notifications
- Floating compose button (FAB)
- Heart animation on like
- Sliding comment sections
- Infinite scroll / load more
- **Complexity:** High (cumulative)

## Anti-Features (do NOT build)
- Direct messaging — high complexity, not core to feed experience
- Story/ephemeral content — different paradigm entirely
- Video upload/processing — infrastructure heavy
- Real-time updates — unnecessary complexity for demo
- Email notifications — no email service needed
- Content moderation — out of scope for demo
- Ad system — not relevant
