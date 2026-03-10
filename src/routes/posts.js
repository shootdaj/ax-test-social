const { Router } = require('express');
const { store, generateId } = require('../store');

const router = Router();

// Helper to extract hashtags from text
function extractHashtags(text) {
  const matches = text.match(/#(\w+)/g);
  return matches ? matches.map(tag => tag.substring(1).toLowerCase()) : [];
}

// Helper to enrich a post with author info, counts, and user-specific state
function enrichPost(post, currentUserId) {
  const author = store.users.get(post.author_id);
  const likeSet = store.likes.get(post.id) || new Set();
  const commentList = store.comments.get(post.id) || [];

  return {
    ...post,
    author: author ? {
      id: author.id,
      username: author.username,
      display_name: author.display_name,
      avatar_url: author.avatar_url
    } : null,
    like_count: likeSet.size,
    comment_count: commentList.length,
    liked: currentUserId ? likeSet.has(currentUserId) : false,
    bookmarked: currentUserId ? (store.bookmarks.get(currentUserId)?.has(post.id) || false) : false,
    hashtags: extractHashtags(post.text)
  };
}

// Create a post
router.post('/api/posts', (req, res) => {
  const { user_id, text, image_url } = req.body;
  if (!user_id || !text) {
    return res.status(400).json({ error: 'user_id and text are required' });
  }
  if (!store.users.has(user_id)) {
    return res.status(404).json({ error: 'User not found' });
  }

  const id = generateId('postId');
  const post = {
    id,
    author_id: user_id,
    text,
    image_url: image_url || null,
    created_at: new Date().toISOString(),
    updated_at: null
  };
  store.posts.set(id, post);
  store.likes.set(id, new Set());
  store.comments.set(id, []);

  res.status(201).json(enrichPost(post, user_id));
});

// Get a single post
router.get('/api/posts/:id', (req, res) => {
  const post = store.posts.get(req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  const currentUserId = req.query.user_id || null;
  res.json(enrichPost(post, currentUserId));
});

// Edit a post
router.put('/api/posts/:id', (req, res) => {
  const post = store.posts.get(req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  const { user_id, text } = req.body;
  if (post.author_id !== user_id) {
    return res.status(403).json({ error: 'Not authorized to edit this post' });
  }

  if (text !== undefined) post.text = text;
  post.updated_at = new Date().toISOString();
  store.posts.set(req.params.id, post);

  res.json(enrichPost(post, user_id));
});

// Delete a post
router.delete('/api/posts/:id', (req, res) => {
  const post = store.posts.get(req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  const user_id = req.query.user_id || (req.body && req.body.user_id);
  if (post.author_id !== user_id) {
    return res.status(403).json({ error: 'Not authorized to delete this post' });
  }

  store.posts.delete(req.params.id);
  store.likes.delete(req.params.id);
  store.comments.delete(req.params.id);

  res.json({ deleted: true });
});

// Get personalized feed (posts from followed users)
router.get('/api/feed', (req, res) => {
  const { user_id, limit = '10', offset = '0' } = req.query;
  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' });
  }

  const following = store.follows.get(user_id);
  if (!following) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Include own posts + followed users' posts
  const feedPosts = Array.from(store.posts.values())
    .filter(post => following.has(post.author_id) || post.author_id === user_id)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(Number(offset), Number(offset) + Number(limit))
    .map(post => enrichPost(post, user_id));

  const total = Array.from(store.posts.values())
    .filter(post => following.has(post.author_id) || post.author_id === user_id)
    .length;

  res.json({
    posts: feedPosts,
    total,
    has_more: Number(offset) + Number(limit) < total
  });
});

// Get explore page (all posts)
router.get('/api/explore', (req, res) => {
  const { user_id, limit = '10', offset = '0' } = req.query;

  const allPosts = Array.from(store.posts.values())
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(Number(offset), Number(offset) + Number(limit))
    .map(post => enrichPost(post, user_id || null));

  const total = store.posts.size;

  res.json({
    posts: allPosts,
    total,
    has_more: Number(offset) + Number(limit) < total
  });
});

// Get trending posts (most liked in last 24h)
router.get('/api/trending', (req, res) => {
  const { user_id, limit = '10' } = req.query;
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const trending = Array.from(store.posts.values())
    .filter(post => new Date(post.created_at) > oneDayAgo)
    .map(post => ({
      post,
      likeCount: store.likes.get(post.id)?.size || 0
    }))
    .sort((a, b) => b.likeCount - a.likeCount)
    .slice(0, Number(limit))
    .map(({ post }) => enrichPost(post, user_id || null));

  res.json({ posts: trending });
});

// Get posts by a specific user
router.get('/api/users/:id/posts', (req, res) => {
  const userId = req.params.id;
  const { user_id, limit = '10', offset = '0' } = req.query;

  if (!store.users.has(userId)) {
    return res.status(404).json({ error: 'User not found' });
  }

  const userPosts = Array.from(store.posts.values())
    .filter(post => post.author_id === userId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(Number(offset), Number(offset) + Number(limit))
    .map(post => enrichPost(post, user_id || null));

  const total = Array.from(store.posts.values())
    .filter(post => post.author_id === userId).length;

  res.json({
    posts: userPosts,
    total,
    has_more: Number(offset) + Number(limit) < total
  });
});

// Search posts by hashtag
router.get('/api/search/hashtag', (req, res) => {
  const { tag, user_id, limit = '10', offset = '0' } = req.query;
  if (!tag) {
    return res.status(400).json({ error: 'tag query parameter is required' });
  }

  const normalizedTag = tag.toLowerCase().replace(/^#/, '');
  const matchingPosts = Array.from(store.posts.values())
    .filter(post => extractHashtags(post.text).includes(normalizedTag))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(Number(offset), Number(offset) + Number(limit))
    .map(post => enrichPost(post, user_id || null));

  res.json({ posts: matchingPosts, tag: normalizedTag });
});

module.exports = router;
module.exports.enrichPost = enrichPost;
module.exports.extractHashtags = extractHashtags;
