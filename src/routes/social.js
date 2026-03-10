const { Router } = require('express');
const { store, generateId } = require('../store');
const { enrichPost } = require('./posts');

const router = Router();

// Like a post
router.post('/api/posts/:id/like', (req, res) => {
  const postId = req.params.id;
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' });
  }
  if (!store.posts.has(postId)) {
    return res.status(404).json({ error: 'Post not found' });
  }

  const likes = store.likes.get(postId);
  likes.add(user_id);

  // Create notification for post author
  const post = store.posts.get(postId);
  if (post.author_id !== user_id) {
    const liker = store.users.get(user_id);
    const notifId = generateId('notificationId');
    const notifications = store.notifications.get(post.author_id) || [];
    notifications.unshift({
      id: notifId,
      type: 'like',
      from_user_id: user_id,
      from_username: liker.username,
      from_display_name: liker.display_name,
      from_avatar_url: liker.avatar_url,
      post_id: postId,
      message: `${liker.display_name} liked your post`,
      read: false,
      created_at: new Date().toISOString()
    });
    if (notifications.length > 50) notifications.pop();
    store.notifications.set(post.author_id, notifications);
  }

  res.json({ liked: true, like_count: likes.size });
});

// Unlike a post
router.delete('/api/posts/:id/like', (req, res) => {
  const postId = req.params.id;
  const user_id = req.query.user_id || (req.body && req.body.user_id);

  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' });
  }
  if (!store.posts.has(postId)) {
    return res.status(404).json({ error: 'Post not found' });
  }

  const likes = store.likes.get(postId);
  likes.delete(user_id);

  res.json({ liked: false, like_count: likes.size });
});

// Add comment to a post
router.post('/api/posts/:id/comments', (req, res) => {
  const postId = req.params.id;
  const { user_id, text } = req.body;

  if (!user_id || !text) {
    return res.status(400).json({ error: 'user_id and text are required' });
  }
  if (!store.posts.has(postId)) {
    return res.status(404).json({ error: 'Post not found' });
  }
  if (!store.users.has(user_id)) {
    return res.status(404).json({ error: 'User not found' });
  }

  const id = generateId('commentId');
  const author = store.users.get(user_id);
  const comment = {
    id,
    post_id: postId,
    author_id: user_id,
    author_username: author.username,
    author_display_name: author.display_name,
    author_avatar_url: author.avatar_url,
    text,
    created_at: new Date().toISOString()
  };

  const comments = store.comments.get(postId) || [];
  comments.push(comment);
  store.comments.set(postId, comments);

  // Create notification for post author
  const post = store.posts.get(postId);
  if (post.author_id !== user_id) {
    const notifId = generateId('notificationId');
    const notifications = store.notifications.get(post.author_id) || [];
    notifications.unshift({
      id: notifId,
      type: 'comment',
      from_user_id: user_id,
      from_username: author.username,
      from_display_name: author.display_name,
      from_avatar_url: author.avatar_url,
      post_id: postId,
      message: `${author.display_name} commented on your post`,
      read: false,
      created_at: new Date().toISOString()
    });
    if (notifications.length > 50) notifications.pop();
    store.notifications.set(post.author_id, notifications);
  }

  res.status(201).json(comment);
});

// Get comments for a post
router.get('/api/posts/:id/comments', (req, res) => {
  const postId = req.params.id;
  if (!store.posts.has(postId)) {
    return res.status(404).json({ error: 'Post not found' });
  }

  const comments = (store.comments.get(postId) || [])
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  res.json({ comments, count: comments.length });
});

// Delete a comment
router.delete('/api/comments/:id', (req, res) => {
  const commentId = req.params.id;
  const user_id = req.query.user_id || (req.body && req.body.user_id);

  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' });
  }

  // Find the comment across all posts
  for (const [postId, comments] of store.comments.entries()) {
    const index = comments.findIndex(c => c.id === commentId);
    if (index !== -1) {
      if (comments[index].author_id !== user_id) {
        return res.status(403).json({ error: 'Not authorized to delete this comment' });
      }
      comments.splice(index, 1);
      store.comments.set(postId, comments);
      return res.json({ deleted: true });
    }
  }

  res.status(404).json({ error: 'Comment not found' });
});

// Bookmark a post
router.post('/api/posts/:id/bookmark', (req, res) => {
  const postId = req.params.id;
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' });
  }
  if (!store.posts.has(postId)) {
    return res.status(404).json({ error: 'Post not found' });
  }

  const bookmarks = store.bookmarks.get(user_id) || new Set();
  bookmarks.add(postId);
  store.bookmarks.set(user_id, bookmarks);

  res.json({ bookmarked: true });
});

// Remove bookmark
router.delete('/api/posts/:id/bookmark', (req, res) => {
  const postId = req.params.id;
  const user_id = req.query.user_id || (req.body && req.body.user_id);

  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' });
  }

  const bookmarks = store.bookmarks.get(user_id) || new Set();
  bookmarks.delete(postId);
  store.bookmarks.set(user_id, bookmarks);

  res.json({ bookmarked: false });
});

// Get bookmarked posts
router.get('/api/bookmarks', (req, res) => {
  const { user_id, limit = '10', offset = '0' } = req.query;
  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' });
  }

  const bookmarkIds = store.bookmarks.get(user_id) || new Set();
  const bookmarkedPosts = Array.from(bookmarkIds)
    .map(id => store.posts.get(id))
    .filter(Boolean)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(Number(offset), Number(offset) + Number(limit))
    .map(post => enrichPost(post, user_id));

  res.json({
    posts: bookmarkedPosts,
    total: bookmarkIds.size,
    has_more: Number(offset) + Number(limit) < bookmarkIds.size
  });
});

module.exports = router;
