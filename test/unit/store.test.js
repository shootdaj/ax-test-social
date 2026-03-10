const { describe, it } = require('node:test');
const assert = require('node:assert');

describe('Store', () => {
  it('should initialize with 5 seeded users', () => {
    // Re-require to get fresh store
    const { store } = require('../../src/store');
    assert.strictEqual(store.users.size, 5);
  });

  it('should initialize with 20 seeded posts', () => {
    const { store } = require('../../src/store');
    assert.strictEqual(store.posts.size, 20);
  });

  it('should have follow relationships set up', () => {
    const { store } = require('../../src/store');
    // Alex (1) follows Sarah (2), Markus (3), Emily (4)
    assert.ok(store.follows.get('1').has('2'));
    assert.ok(store.follows.get('1').has('3'));
    assert.ok(store.follows.get('1').has('4'));
  });

  it('should have follower relationships matching follows', () => {
    const { store } = require('../../src/store');
    // Sarah (2) should have Alex (1) as follower
    assert.ok(store.followers.get('2').has('1'));
  });

  it('should generate incrementing IDs', () => {
    const { generateId } = require('../../src/store');
    const id1 = generateId('userId');
    const id2 = generateId('userId');
    assert.ok(Number(id2) > Number(id1));
  });

  it('should have seed comments', () => {
    const { store } = require('../../src/store');
    const post1Comments = store.comments.get('1') || [];
    assert.ok(post1Comments.length > 0, 'Post 1 should have comments');
  });

  it('should have seed likes', () => {
    const { store } = require('../../src/store');
    const post1Likes = store.likes.get('1') || new Set();
    assert.ok(post1Likes.size > 0, 'Post 1 should have likes');
  });

  it('should have user data with correct fields', () => {
    const { store } = require('../../src/store');
    const user = store.users.get('1');
    assert.ok(user.username);
    assert.ok(user.display_name);
    assert.ok(user.bio);
    assert.ok(user.avatar_url);
    assert.ok(user.created_at);
  });

  it('should have post data with correct fields', () => {
    const { store } = require('../../src/store');
    const post = store.posts.get('1');
    assert.ok(post.author_id);
    assert.ok(post.text);
    assert.ok(post.created_at);
    assert.strictEqual(post.id, '1');
  });
});
