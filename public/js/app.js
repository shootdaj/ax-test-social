// ═══════════════════════════════════════════════
// SocialFeed — Frontend Application
// Vanilla JS SPA with premium interactions
// ═══════════════════════════════════════════════

const API = '';
let currentUser = null;
let currentView = 'feed';
let allUsers = [];

// ── SVG Icons ──
const icons = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  explore: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>',
  bookmark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>',
  bookmarkFilled: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>',
  heartFilled: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>',
  comment: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  chevronDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  trending: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
};

// ── Helpers ──
function timeAgo(dateStr) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatPostText(text) {
  let html = escapeHtml(text);
  // Convert hashtags to clickable pills
  html = html.replace(/#(\w+)/g, '<span class="hashtag" onclick="navigateHashtag(\'$1\')">#$1</span>');
  return html;
}

async function api(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (body && method !== 'GET') opts.body = JSON.stringify(body);
  try {
    const res = await fetch(`${API}${path}`, opts);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  } catch (err) {
    showToast(err.message, 'error');
    throw err;
  }
}

// ── Toast System ──
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('toast-exit');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ── Skeleton Loaders ──
function renderSkeletons(count = 3) {
  let html = '';
  for (let i = 0; i < count; i++) {
    html += `
      <div class="skeleton-card" style="animation-delay: ${i * 0.1}s">
        <div class="skeleton-header">
          <div class="skeleton skeleton-avatar"></div>
          <div style="flex:1">
            <div class="skeleton skeleton-line skeleton-line-short"></div>
            <div class="skeleton skeleton-line" style="width:25%;height:10px;"></div>
          </div>
        </div>
        <div class="skeleton skeleton-line skeleton-line-full"></div>
        <div class="skeleton skeleton-line skeleton-line-medium"></div>
        ${i % 2 === 0 ? '<div class="skeleton skeleton-image"></div>' : ''}
      </div>
    `;
  }
  return html;
}

// ── Post Card Renderer ──
function renderPostCard(post) {
  const authorAvatar = post.author?.avatar_url || '';
  const authorName = post.author?.display_name || 'Unknown';
  const authorUsername = post.author?.username || '';
  const isOwn = post.author_id === currentUser?.id;

  return `
    <div class="post-card" id="post-${post.id}">
      <div class="post-header">
        <div class="avatar-gradient-border">
          <img class="post-avatar" src="${authorAvatar}" alt="${authorName}"
               onclick="navigateProfile('${post.author_id}')" loading="lazy">
        </div>
        <div class="post-meta">
          <div class="post-author" onclick="navigateProfile('${post.author_id}')">${escapeHtml(authorName)}</div>
          <span class="post-username">@${escapeHtml(authorUsername)}</span>
          <span class="post-time"> &middot; ${timeAgo(post.created_at)}</span>
        </div>
      </div>
      <div class="post-body">
        <div class="post-text">${formatPostText(post.text)}</div>
        ${post.image_url ? `<img class="post-image" src="${post.image_url}" alt="Post image" loading="lazy" onerror="this.style.display='none'">` : ''}
      </div>
      <div class="post-actions">
        <button class="action-btn like-btn ${post.liked ? 'liked' : ''}" onclick="toggleLike('${post.id}', ${post.liked})">
          ${post.liked ? icons.heartFilled : icons.heart}
          <span class="like-count">${post.like_count || ''}</span>
        </button>
        <button class="action-btn comment-btn" onclick="toggleComments('${post.id}')">
          ${icons.comment}
          <span>${post.comment_count || ''}</span>
        </button>
        <button class="action-btn bookmark-btn ${post.bookmarked ? 'bookmarked' : ''}" onclick="toggleBookmark('${post.id}', ${post.bookmarked})">
          ${post.bookmarked ? icons.bookmarkFilled : icons.bookmark}
        </button>
      </div>
      <div class="comments-section" id="comments-${post.id}">
        <div class="comments-list" id="comments-list-${post.id}"></div>
        <div class="comment-form">
          <input class="comment-input" id="comment-input-${post.id}" placeholder="Write a comment..."
                 onkeydown="if(event.key==='Enter')submitComment('${post.id}')">
          <button class="comment-submit" onclick="submitComment('${post.id}')">Post</button>
        </div>
      </div>
    </div>
  `;
}

// ── Actions ──
async function toggleLike(postId, isLiked) {
  try {
    if (isLiked) {
      await api('DELETE', `/api/posts/${postId}/like?user_id=${currentUser.id}`);
    } else {
      await api('POST', `/api/posts/${postId}/like`, { user_id: currentUser.id });
    }
    // Re-fetch and re-render just this post
    const post = await api('GET', `/api/posts/${postId}?user_id=${currentUser.id}`);
    const card = document.getElementById(`post-${postId}`);
    if (card) {
      card.outerHTML = renderPostCard(post);
    }
  } catch (e) { /* toast already shown */ }
}

async function toggleBookmark(postId, isBookmarked) {
  try {
    if (isBookmarked) {
      await api('DELETE', `/api/posts/${postId}/bookmark?user_id=${currentUser.id}`);
      showToast('Bookmark removed', 'info');
    } else {
      await api('POST', `/api/posts/${postId}/bookmark`, { user_id: currentUser.id });
      showToast('Post bookmarked', 'success');
    }
    const post = await api('GET', `/api/posts/${postId}?user_id=${currentUser.id}`);
    const card = document.getElementById(`post-${postId}`);
    if (card) card.outerHTML = renderPostCard(post);
  } catch (e) { /* toast already shown */ }
}

async function toggleComments(postId) {
  const section = document.getElementById(`comments-${postId}`);
  if (section.classList.contains('open')) {
    section.classList.remove('open');
    return;
  }
  section.classList.add('open');
  try {
    const data = await api('GET', `/api/posts/${postId}/comments`);
    const list = document.getElementById(`comments-list-${postId}`);
    if (data.comments.length === 0) {
      list.innerHTML = '<p style="text-align:center;color:var(--color-text-muted);font-size:0.875rem;padding:8px;">No comments yet</p>';
    } else {
      list.innerHTML = data.comments.map(c => `
        <div class="comment">
          <img class="comment-avatar" src="${c.author_avatar_url || ''}" alt="" loading="lazy">
          <div class="comment-body">
            <span class="comment-author">${escapeHtml(c.author_display_name || c.author_username || '')}</span>
            <div class="comment-text">${escapeHtml(c.text)}</div>
            <div class="comment-time">${timeAgo(c.created_at)}</div>
          </div>
        </div>
      `).join('');
    }
  } catch (e) { /* toast already shown */ }
}

async function submitComment(postId) {
  const input = document.getElementById(`comment-input-${postId}`);
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  try {
    await api('POST', `/api/posts/${postId}/comments`, { user_id: currentUser.id, text });
    showToast('Comment added', 'success');
    // Re-load comments
    await toggleComments(postId);
    // Force open
    document.getElementById(`comments-${postId}`).classList.add('open');
    // Update comment count in card
    const post = await api('GET', `/api/posts/${postId}?user_id=${currentUser.id}`);
    const card = document.getElementById(`post-${postId}`);
    if (card) card.outerHTML = renderPostCard(post);
    // Re-open comments
    document.getElementById(`comments-${postId}`).classList.add('open');
    await toggleComments(postId);
    document.getElementById(`comments-${postId}`).classList.add('open');
  } catch (e) { /* toast already shown */ }
}

// ── Navigation ──
function navigate(view, params = {}) {
  currentView = view;
  window._viewParams = params;
  renderApp();
}

function navigateProfile(userId) {
  navigate('profile', { userId });
}

function navigateHashtag(tag) {
  navigate('hashtag', { tag });
}

// ── Views ──
async function renderFeedView() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="tabs">
      <button class="tab active" onclick="switchFeedTab('feed')">Following</button>
      <button class="tab" onclick="switchFeedTab('explore')">Explore</button>
      <button class="tab" onclick="switchFeedTab('trending')">Trending</button>
    </div>
    <div id="posts-container">${renderSkeletons()}</div>
    <div id="load-more-container"></div>
  `;
  await loadPosts('feed');
}

let currentFeedOffset = 0;
const FEED_LIMIT = 10;

async function switchFeedTab(tab) {
  currentFeedOffset = 0;
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  const container = document.getElementById('posts-container');
  container.innerHTML = renderSkeletons();
  await loadPosts(tab);
}

async function loadPosts(tab, append = false) {
  try {
    let data;
    if (tab === 'feed') {
      data = await api('GET', `/api/feed?user_id=${currentUser.id}&limit=${FEED_LIMIT}&offset=${currentFeedOffset}`);
    } else if (tab === 'explore') {
      data = await api('GET', `/api/explore?user_id=${currentUser.id}&limit=${FEED_LIMIT}&offset=${currentFeedOffset}`);
    } else if (tab === 'trending') {
      data = await api('GET', `/api/trending?user_id=${currentUser.id}&limit=${FEED_LIMIT}`);
    }

    const container = document.getElementById('posts-container');
    const loadMoreContainer = document.getElementById('load-more-container');

    if (!append) container.innerHTML = '';

    if (data.posts.length === 0 && !append) {
      container.innerHTML = `
        <div class="empty-state">
          ${icons.home}
          <h3>No posts yet</h3>
          <p>Follow some users or create your first post!</p>
        </div>
      `;
      loadMoreContainer.innerHTML = '';
      return;
    }

    container.innerHTML += data.posts.map(renderPostCard).join('');

    if (data.has_more) {
      window._currentTab = tab;
      loadMoreContainer.innerHTML = `
        <div class="load-more">
          <button class="load-more-btn" onclick="loadMorePosts()">
            Load more
          </button>
        </div>
      `;
    } else {
      loadMoreContainer.innerHTML = '';
    }
  } catch (e) { /* toast already shown */ }
}

async function loadMorePosts() {
  const btn = document.querySelector('.load-more-btn');
  btn.innerHTML = '<div class="spinner"></div> Loading...';
  btn.disabled = true;
  currentFeedOffset += FEED_LIMIT;
  await loadPosts(window._currentTab || 'feed', true);
}

async function renderProfileView(userId) {
  const content = document.getElementById('content');
  content.innerHTML = renderSkeletons(1);

  try {
    const user = await api('GET', `/api/users/${userId}`);
    const followStatus = currentUser.id !== userId
      ? await api('GET', `/api/users/${userId}/follow/status?user_id=${currentUser.id}`)
      : { following: false };
    const postsData = await api('GET', `/api/users/${userId}/posts?user_id=${currentUser.id}`);

    const isOwn = currentUser.id === userId;

    content.innerHTML = `
      <div class="profile-header">
        <div class="profile-cover"></div>
        <div class="profile-info">
          <div class="profile-avatar-gradient">
            <img class="profile-avatar" src="${user.avatar_url}" alt="${escapeHtml(user.display_name)}" loading="lazy">
          </div>
          ${!isOwn ? `
            <div class="profile-actions">
              <button class="follow-btn ${followStatus.following ? 'following' : 'not-following'}"
                      onclick="toggleFollow('${userId}', ${followStatus.following})">
                ${followStatus.following ? 'Following' : 'Follow'}
              </button>
            </div>
          ` : ''}
          <div class="profile-name">${escapeHtml(user.display_name)}</div>
          <div class="profile-username">@${escapeHtml(user.username)}</div>
          <div class="profile-bio">${escapeHtml(user.bio || '')}</div>
          <div class="profile-stats">
            <div class="profile-stat">
              <span class="profile-stat-count">${user.post_count || 0}</span>
              <span class="profile-stat-label">Posts</span>
            </div>
            <div class="profile-stat">
              <span class="profile-stat-count">${user.follower_count || 0}</span>
              <span class="profile-stat-label">Followers</span>
            </div>
            <div class="profile-stat">
              <span class="profile-stat-count">${user.following_count || 0}</span>
              <span class="profile-stat-label">Following</span>
            </div>
          </div>
        </div>
      </div>
      <div id="posts-container">
        ${postsData.posts.length === 0
          ? '<div class="empty-state"><h3>No posts yet</h3></div>'
          : postsData.posts.map(renderPostCard).join('')
        }
      </div>
    `;
  } catch (e) { /* toast already shown */ }
}

async function toggleFollow(userId, isFollowing) {
  try {
    if (isFollowing) {
      await api('DELETE', `/api/users/${userId}/follow?user_id=${currentUser.id}`);
      showToast('Unfollowed', 'info');
    } else {
      await api('POST', `/api/users/${userId}/follow`, { user_id: currentUser.id });
      showToast('Following!', 'success');
    }
    renderProfileView(userId);
  } catch (e) { /* toast already shown */ }
}

async function renderNotificationsView() {
  const content = document.getElementById('content');
  content.innerHTML = '<h2 class="page-title">Notifications</h2>' + renderSkeletons(2);

  try {
    const data = await api('GET', `/api/notifications?user_id=${currentUser.id}`);
    // Mark all as read
    if (data.unread_count > 0) {
      await api('PUT', '/api/notifications/read-all', { user_id: currentUser.id });
      updateNotificationBadge(0);
    }

    if (data.notifications.length === 0) {
      content.innerHTML = `
        <h2 class="page-title">Notifications</h2>
        <div class="empty-state">
          ${icons.bell}
          <h3>No notifications</h3>
          <p>When someone interacts with your posts, you'll see it here.</p>
        </div>
      `;
      return;
    }

    const notifIcons = { follow: icons.user, like: icons.heartFilled, comment: icons.comment };
    content.innerHTML = `
      <h2 class="page-title">Notifications</h2>
      ${data.notifications.map(n => `
        <div class="notification-item ${n.read ? '' : 'unread'}">
          <img class="notification-avatar" src="${n.from_avatar_url || ''}" alt="" loading="lazy"
               onclick="navigateProfile('${n.from_user_id}')">
          <div class="notification-content">
            <div class="notification-message">${escapeHtml(n.message)}</div>
            <div class="notification-time">${timeAgo(n.created_at)}</div>
          </div>
          <div class="notification-icon ${n.type}">${notifIcons[n.type] || ''}</div>
        </div>
      `).join('')}
    `;
  } catch (e) { /* toast already shown */ }
}

async function renderBookmarksView() {
  const content = document.getElementById('content');
  content.innerHTML = '<h2 class="page-title">Bookmarks</h2>' + renderSkeletons(2);

  try {
    const data = await api('GET', `/api/bookmarks?user_id=${currentUser.id}`);

    if (data.posts.length === 0) {
      content.innerHTML = `
        <h2 class="page-title">Bookmarks</h2>
        <div class="empty-state">
          ${icons.bookmark}
          <h3>No bookmarks yet</h3>
          <p>Save posts for later by clicking the bookmark icon.</p>
        </div>
      `;
      return;
    }

    content.innerHTML = `
      <h2 class="page-title">Bookmarks</h2>
      <div id="posts-container">
        ${data.posts.map(renderPostCard).join('')}
      </div>
    `;
  } catch (e) { /* toast already shown */ }
}

async function renderHashtagView(tag) {
  const content = document.getElementById('content');
  content.innerHTML = `<h2 class="page-title">#${escapeHtml(tag)}</h2>` + renderSkeletons(2);

  try {
    const data = await api('GET', `/api/search/hashtag?tag=${encodeURIComponent(tag)}&user_id=${currentUser.id}`);

    if (data.posts.length === 0) {
      content.innerHTML = `
        <h2 class="page-title">#${escapeHtml(tag)}</h2>
        <div class="empty-state">
          <h3>No posts with #${escapeHtml(tag)}</h3>
        </div>
      `;
      return;
    }

    content.innerHTML = `
      <h2 class="page-title">#${escapeHtml(tag)}</h2>
      <div id="posts-container">
        ${data.posts.map(renderPostCard).join('')}
      </div>
    `;
  } catch (e) { /* toast already shown */ }
}

// ── Compose Modal ──
function openCompose() {
  document.getElementById('compose-modal').classList.add('open');
  setTimeout(() => document.getElementById('compose-text').focus(), 300);
}

function closeCompose() {
  document.getElementById('compose-modal').classList.remove('open');
  document.getElementById('compose-text').value = '';
  document.getElementById('compose-image').value = '';
}

async function submitPost() {
  const text = document.getElementById('compose-text').value.trim();
  const imageUrl = document.getElementById('compose-image').value.trim();
  if (!text) return;

  try {
    await api('POST', '/api/posts', {
      user_id: currentUser.id,
      text,
      image_url: imageUrl || undefined
    });
    closeCompose();
    showToast('Post published!', 'success');
    if (currentView === 'feed') {
      currentFeedOffset = 0;
      const container = document.getElementById('posts-container');
      if (container) {
        container.innerHTML = renderSkeletons();
        await loadPosts('feed');
      }
    }
  } catch (e) { /* toast already shown */ }
}

// ── Notification Badge ──
async function checkNotifications() {
  try {
    const data = await api('GET', `/api/notifications/unread-count?user_id=${currentUser.id}`);
    updateNotificationBadge(data.unread_count);
  } catch (e) { /* silent */ }
}

function updateNotificationBadge(count) {
  const badge = document.getElementById('notif-badge');
  if (badge) {
    badge.style.display = count > 0 ? 'block' : 'none';
  }
}

// ── User Switcher ──
function toggleUserSwitcher() {
  const dropdown = document.getElementById('user-dropdown');
  dropdown.classList.toggle('open');
}

function switchUser(userId) {
  currentUser = allUsers.find(u => u.id === userId);
  document.getElementById('user-dropdown').classList.remove('open');
  renderApp();
  showToast(`Switched to ${currentUser.display_name}`, 'info');
}

// ── Main Render ──
function renderApp() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <nav class="nav">
      <div class="nav-inner">
        <div class="nav-logo" style="cursor:pointer" onclick="navigate('feed')">SocialFeed</div>
        <div class="nav-links">
          <button class="nav-link ${currentView === 'feed' ? 'active' : ''}" onclick="navigate('feed')" title="Home">
            ${icons.home}
          </button>
          <button class="nav-link ${currentView === 'explore' ? 'active' : ''}" onclick="navigate('feed')" title="Explore">
            ${icons.explore}
          </button>
          <button class="nav-link ${currentView === 'notifications' ? 'active' : ''}" onclick="navigate('notifications')" title="Notifications">
            ${icons.bell}
            <span class="notification-badge" id="notif-badge" style="display:none"></span>
          </button>
          <button class="nav-link ${currentView === 'bookmarks' ? 'active' : ''}" onclick="navigate('bookmarks')" title="Bookmarks">
            ${icons.bookmark}
          </button>
          <div class="user-switcher">
            <button class="user-switcher-btn" onclick="toggleUserSwitcher()">
              <img src="${currentUser?.avatar_url || ''}" alt="">
              ${icons.chevronDown}
            </button>
            <div class="user-switcher-dropdown" id="user-dropdown">
              ${allUsers.map(u => `
                <button class="user-switcher-dropdown-item ${u.id === currentUser?.id ? 'active' : ''}"
                        onclick="switchUser('${u.id}')">
                  <img src="${u.avatar_url}" alt="">
                  <div>
                    <div class="name">${escapeHtml(u.display_name)}</div>
                    <div class="username">@${escapeHtml(u.username)}</div>
                  </div>
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main class="main" id="content"></main>

    <button class="fab" onclick="openCompose()" title="Create post">
      ${icons.plus}
    </button>

    <div class="modal-overlay" id="compose-modal" onclick="if(event.target===this)closeCompose()">
      <div class="modal">
        <div class="modal-header">
          <span class="modal-title">Create Post</span>
          <button class="modal-close" onclick="closeCompose()">${icons.x}</button>
        </div>
        <div class="modal-body">
          <textarea class="compose-textarea" id="compose-text" placeholder="What's on your mind?"></textarea>
          <input class="compose-image-input" id="compose-image" placeholder="Image URL (optional)">
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" onclick="closeCompose()">Cancel</button>
          <button class="btn-primary" onclick="submitPost()">Publish</button>
        </div>
      </div>
    </div>

    <div class="toast-container" id="toast-container"></div>
  `;

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    const switcher = document.querySelector('.user-switcher');
    const dropdown = document.getElementById('user-dropdown');
    if (switcher && dropdown && !switcher.contains(e.target)) {
      dropdown.classList.remove('open');
    }
  });

  // Render current view
  const params = window._viewParams || {};
  switch (currentView) {
    case 'feed': renderFeedView(); break;
    case 'profile': renderProfileView(params.userId); break;
    case 'notifications': renderNotificationsView(); break;
    case 'bookmarks': renderBookmarksView(); break;
    case 'hashtag': renderHashtagView(params.tag); break;
    default: renderFeedView();
  }

  checkNotifications();
}

// ── Init ──
async function init() {
  try {
    const data = await api('GET', '/api/users');
    allUsers = data.users;
    currentUser = allUsers[0]; // Default to first user (Alex)
    renderApp();
  } catch (e) {
    document.getElementById('app').innerHTML = `
      <div style="text-align:center;padding:48px;color:#6c757d;">
        <h2>Failed to load</h2>
        <p>Could not connect to the API. Please refresh.</p>
      </div>
    `;
  }
}

init();
