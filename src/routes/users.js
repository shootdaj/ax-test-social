const { Router } = require('express');
const { store, generateId } = require('../store');

const router = Router();

// Get all users
router.get('/api/users', (req, res) => {
  const users = Array.from(store.users.values()).map(user => ({
    ...user,
    follower_count: store.followers.get(user.id)?.size || 0,
    following_count: store.follows.get(user.id)?.size || 0,
    post_count: Array.from(store.posts.values()).filter(p => p.author_id === user.id).length
  }));
  res.json({ users });
});

// Get user by ID
router.get('/api/users/:id', (req, res) => {
  const user = store.users.get(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({
    ...user,
    follower_count: store.followers.get(user.id)?.size || 0,
    following_count: store.follows.get(user.id)?.size || 0,
    post_count: Array.from(store.posts.values()).filter(p => p.author_id === user.id).length
  });
});

// Create user
router.post('/api/users', (req, res) => {
  const { username, display_name, bio, avatar_url } = req.body;
  if (!username || !display_name) {
    return res.status(400).json({ error: 'username and display_name are required' });
  }

  // Check for duplicate username
  const existing = Array.from(store.users.values()).find(u => u.username === username);
  if (existing) {
    return res.status(409).json({ error: 'Username already taken' });
  }

  const id = generateId('userId');
  const user = {
    id,
    username,
    display_name,
    bio: bio || '',
    avatar_url: avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    created_at: new Date().toISOString()
  };
  store.users.set(id, user);
  store.follows.set(id, new Set());
  store.followers.set(id, new Set());
  store.notifications.set(id, []);
  store.bookmarks.set(id, new Set());

  res.status(201).json(user);
});

// Update user profile
router.put('/api/users/:id', (req, res) => {
  const user = store.users.get(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { display_name, bio, avatar_url } = req.body;
  if (display_name !== undefined) user.display_name = display_name;
  if (bio !== undefined) user.bio = bio;
  if (avatar_url !== undefined) user.avatar_url = avatar_url;

  store.users.set(req.params.id, user);
  res.json(user);
});

// Search users by username or display_name
router.get('/api/search/users', (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Query parameter q is required' });
  }

  const query = q.toLowerCase();
  const results = Array.from(store.users.values())
    .filter(user =>
      user.username.toLowerCase().includes(query) ||
      user.display_name.toLowerCase().includes(query)
    )
    .map(user => ({
      ...user,
      follower_count: store.followers.get(user.id)?.size || 0,
      following_count: store.follows.get(user.id)?.size || 0
    }));

  res.json({ users: results });
});

// Follow a user
router.post('/api/users/:id/follow', (req, res) => {
  const { user_id } = req.body; // the user doing the following
  const targetId = req.params.id;

  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' });
  }
  if (user_id === targetId) {
    return res.status(400).json({ error: 'Cannot follow yourself' });
  }
  if (!store.users.has(user_id) || !store.users.has(targetId)) {
    return res.status(404).json({ error: 'User not found' });
  }

  store.follows.get(user_id).add(targetId);
  store.followers.get(targetId).add(user_id);

  // Create notification for the target user
  const follower = store.users.get(user_id);
  const notifId = generateId('notificationId');
  const notifications = store.notifications.get(targetId) || [];
  notifications.unshift({
    id: notifId,
    type: 'follow',
    from_user_id: user_id,
    from_username: follower.username,
    from_display_name: follower.display_name,
    from_avatar_url: follower.avatar_url,
    message: `${follower.display_name} started following you`,
    read: false,
    created_at: new Date().toISOString()
  });
  // Cap at 50 notifications
  if (notifications.length > 50) notifications.pop();
  store.notifications.set(targetId, notifications);

  res.json({
    following: true,
    follower_count: store.followers.get(targetId).size,
    following_count: store.follows.get(user_id).size
  });
});

// Unfollow a user
router.delete('/api/users/:id/follow', (req, res) => {
  const user_id = req.query.user_id || (req.body && req.body.user_id);
  const targetId = req.params.id;

  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' });
  }
  if (!store.users.has(user_id) || !store.users.has(targetId)) {
    return res.status(404).json({ error: 'User not found' });
  }

  store.follows.get(user_id).delete(targetId);
  store.followers.get(targetId).delete(user_id);

  res.json({
    following: false,
    follower_count: store.followers.get(targetId).size,
    following_count: store.follows.get(user_id).size
  });
});

// Get followers of a user
router.get('/api/users/:id/followers', (req, res) => {
  const userId = req.params.id;
  if (!store.users.has(userId)) {
    return res.status(404).json({ error: 'User not found' });
  }

  const followerIds = store.followers.get(userId) || new Set();
  const followers = Array.from(followerIds)
    .map(id => store.users.get(id))
    .filter(Boolean)
    .map(user => ({
      ...user,
      follower_count: store.followers.get(user.id)?.size || 0,
      following_count: store.follows.get(user.id)?.size || 0
    }));

  res.json({ users: followers });
});

// Get users that a user follows
router.get('/api/users/:id/following', (req, res) => {
  const userId = req.params.id;
  if (!store.users.has(userId)) {
    return res.status(404).json({ error: 'User not found' });
  }

  const followingIds = store.follows.get(userId) || new Set();
  const following = Array.from(followingIds)
    .map(id => store.users.get(id))
    .filter(Boolean)
    .map(user => ({
      ...user,
      follower_count: store.followers.get(user.id)?.size || 0,
      following_count: store.follows.get(user.id)?.size || 0
    }));

  res.json({ users: following });
});

// Check if user_id follows target user
router.get('/api/users/:id/follow/status', (req, res) => {
  const { user_id } = req.query;
  const targetId = req.params.id;

  if (!user_id) {
    return res.status(400).json({ error: 'user_id query parameter is required' });
  }

  const following = store.follows.get(user_id)?.has(targetId) || false;
  res.json({ following });
});

module.exports = router;
