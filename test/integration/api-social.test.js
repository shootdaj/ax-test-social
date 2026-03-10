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

describe('Social API (Likes, Comments, Bookmarks)', () => {
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

  it('POST /api/posts/:id/like likes a post', async () => {
    const res = await request('POST', '/api/posts/1/like', { user_id: '4' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.liked, true);
    assert.ok(res.body.like_count > 0);
  });

  it('DELETE /api/posts/:id/like unlikes a post', async () => {
    const res = await request('DELETE', '/api/posts/1/like?user_id=4');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.liked, false);
  });

  it('POST /api/posts/:id/comments adds a comment', async () => {
    const res = await request('POST', '/api/posts/1/comments', {
      user_id: '4',
      text: 'Nice post!'
    });
    assert.strictEqual(res.status, 201);
    assert.ok(res.body.id);
    assert.strictEqual(res.body.text, 'Nice post!');
  });

  it('GET /api/posts/:id/comments returns comments', async () => {
    const res = await request('GET', '/api/posts/1/comments');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.comments));
    assert.ok(res.body.count > 0);
  });

  it('DELETE /api/comments/:id deletes own comment', async () => {
    // Add a comment first
    const created = await request('POST', '/api/posts/2/comments', {
      user_id: '1',
      text: 'To be deleted'
    });
    const res = await request('DELETE', `/api/comments/${created.body.id}?user_id=1`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.deleted, true);
  });

  it('POST /api/posts/:id/bookmark bookmarks a post', async () => {
    const res = await request('POST', '/api/posts/1/bookmark', { user_id: '1' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.bookmarked, true);
  });

  it('GET /api/bookmarks returns bookmarked posts', async () => {
    const res = await request('GET', '/api/bookmarks?user_id=1');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.posts));
  });

  it('DELETE /api/posts/:id/bookmark removes bookmark', async () => {
    const res = await request('DELETE', '/api/posts/1/bookmark?user_id=1');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.bookmarked, false);
  });

  it('GET /api/notifications returns notifications', async () => {
    // Trigger a notification by liking
    await request('POST', '/api/posts/1/like', { user_id: '5' });
    const res = await request('GET', '/api/notifications?user_id=1');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.notifications));
    assert.ok('unread_count' in res.body);
  });

  it('PUT /api/notifications/read-all marks all as read', async () => {
    const res = await request('PUT', '/api/notifications/read-all', { user_id: '1' });
    assert.strictEqual(res.status, 200);
    assert.ok('marked' in res.body);
  });
});
