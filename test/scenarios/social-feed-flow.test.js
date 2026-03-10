const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const http = require('node:http');

let server;
let baseUrl;

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: { 'Content-Type': 'application/json' }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

describe('Scenario: Full Social Feed Workflow', () => {
  before(async () => {
    delete require.cache[require.resolve('../../src/store')];
    delete require.cache[require.resolve('../../src/app')];
    delete require.cache[require.resolve('../../src/routes/users')];
    delete require.cache[require.resolve('../../src/routes/posts')];
    delete require.cache[require.resolve('../../src/routes/social')];
    delete require.cache[require.resolve('../../src/routes/notifications')];

    const app = require('../../src/app');
    await new Promise((resolve) => {
      server = app.listen(0, () => {
        const addr = server.address();
        baseUrl = `http://localhost:${addr.port}`;
        resolve();
      });
    });
  });

  after(async () => {
    if (server) await new Promise(resolve => server.close(resolve));
  });

  it('Complete user journey: create account, follow users, post, interact', async () => {
    // 1. Create new user
    const newUser = await request('POST', '/api/users', {
      username: 'newbie',
      display_name: 'New User',
      bio: 'Just joined!'
    });
    assert.strictEqual(newUser.status, 201);
    const userId = newUser.body.id;

    // 2. Search for users to follow
    const search = await request('GET', '/api/search/users?q=alex');
    assert.ok(search.body.users.length > 0);
    const alexId = search.body.users[0].id;

    // 3. Follow Alex
    const follow = await request('POST', `/api/users/${alexId}/follow`, { user_id: userId });
    assert.strictEqual(follow.body.following, true);

    // 4. Verify Alex got a notification
    const notifications = await request('GET', `/api/notifications?user_id=${alexId}`);
    assert.ok(notifications.body.notifications.some(n => n.type === 'follow'));

    // 5. Create a post with hashtag
    const post = await request('POST', '/api/posts', {
      user_id: userId,
      text: 'My first post! #newhere #excited'
    });
    assert.strictEqual(post.status, 201);
    const postId = post.body.id;

    // 6. Another user likes the post
    const like = await request('POST', `/api/posts/${postId}/like`, { user_id: alexId });
    assert.strictEqual(like.body.liked, true);

    // 7. User got a like notification
    const myNotifs = await request('GET', `/api/notifications?user_id=${userId}`);
    assert.ok(myNotifs.body.notifications.some(n => n.type === 'like'));

    // 8. Someone comments on the post
    const comment = await request('POST', `/api/posts/${postId}/comments`, {
      user_id: alexId,
      text: 'Welcome to the platform!'
    });
    assert.strictEqual(comment.status, 201);

    // 9. Verify comment notification
    const myNotifs2 = await request('GET', `/api/notifications?user_id=${userId}`);
    assert.ok(myNotifs2.body.notifications.some(n => n.type === 'comment'));

    // 10. Bookmark a post
    const bookmark = await request('POST', '/api/posts/1/bookmark', { user_id: userId });
    assert.strictEqual(bookmark.body.bookmarked, true);

    // 11. View bookmarks
    const bookmarks = await request('GET', `/api/bookmarks?user_id=${userId}`);
    assert.ok(bookmarks.body.posts.length > 0);

    // 12. Search by hashtag
    const hashSearch = await request('GET', '/api/search/hashtag?tag=newhere');
    assert.ok(hashSearch.body.posts.length > 0);

    // 13. View personalized feed
    const feed = await request('GET', `/api/feed?user_id=${userId}`);
    assert.ok(feed.body.posts.length > 0);

    // 14. Edit the post
    const edit = await request('PUT', `/api/posts/${postId}`, {
      user_id: userId,
      text: 'My first post (edited)! #newhere #excited'
    });
    assert.strictEqual(edit.body.text, 'My first post (edited)! #newhere #excited');

    // 15. View profile
    const profile = await request('GET', `/api/users/${userId}`);
    assert.strictEqual(profile.body.username, 'newbie');
    assert.ok(profile.body.following_count > 0);

    // 16. Explore page
    const explore = await request('GET', `/api/explore?user_id=${userId}`);
    assert.ok(explore.body.posts.length > 0);

    // 17. Trending
    const trending = await request('GET', `/api/trending?user_id=${userId}`);
    assert.strictEqual(trending.status, 200);

    // 18. Unfollow
    const unfollow = await request('DELETE', `/api/users/${alexId}/follow?user_id=${userId}`);
    assert.strictEqual(unfollow.body.following, false);
  });
});
