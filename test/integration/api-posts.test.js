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

describe('Posts API', () => {
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

  it('POST /api/posts creates a text post', async () => {
    const res = await request('POST', '/api/posts', {
      user_id: '1',
      text: 'Test post #testing'
    });
    assert.strictEqual(res.status, 201);
    assert.ok(res.body.id);
    assert.strictEqual(res.body.author.username, 'alexchen');
    assert.deepStrictEqual(res.body.hashtags, ['testing']);
  });

  it('POST /api/posts creates a post with image', async () => {
    const res = await request('POST', '/api/posts', {
      user_id: '2',
      text: 'Image post',
      image_url: 'https://example.com/img.jpg'
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.image_url, 'https://example.com/img.jpg');
  });

  it('POST /api/posts rejects missing fields', async () => {
    const res = await request('POST', '/api/posts', { user_id: '1' });
    assert.strictEqual(res.status, 400);
  });

  it('GET /api/posts/:id returns a post with enriched data', async () => {
    const res = await request('GET', '/api/posts/1?user_id=1');
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.author);
    assert.ok('like_count' in res.body);
    assert.ok('comment_count' in res.body);
    assert.ok('liked' in res.body);
    assert.ok('hashtags' in res.body);
  });

  it('PUT /api/posts/:id edits post text', async () => {
    const res = await request('PUT', '/api/posts/1', {
      user_id: '1',
      text: 'Updated post text'
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.text, 'Updated post text');
    assert.ok(res.body.updated_at);
  });

  it('PUT /api/posts/:id rejects unauthorized edit', async () => {
    const res = await request('PUT', '/api/posts/1', {
      user_id: '2',
      text: 'Hacking!'
    });
    assert.strictEqual(res.status, 403);
  });

  it('GET /api/feed returns personalized feed', async () => {
    const res = await request('GET', '/api/feed?user_id=1');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.posts));
    assert.ok('total' in res.body);
    assert.ok('has_more' in res.body);
  });

  it('GET /api/feed rejects missing user_id', async () => {
    const res = await request('GET', '/api/feed');
    assert.strictEqual(res.status, 400);
  });

  it('GET /api/explore returns all posts', async () => {
    const res = await request('GET', '/api/explore');
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.posts.length > 0);
  });

  it('GET /api/explore supports pagination', async () => {
    const page1 = await request('GET', '/api/explore?limit=5&offset=0');
    const page2 = await request('GET', '/api/explore?limit=5&offset=5');
    assert.strictEqual(page1.body.posts.length, 5);
    assert.strictEqual(page2.body.posts.length, 5);
    assert.notStrictEqual(page1.body.posts[0].id, page2.body.posts[0].id);
  });

  it('GET /api/trending returns trending posts', async () => {
    const res = await request('GET', '/api/trending');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.posts));
  });

  it('GET /api/users/:id/posts returns user posts', async () => {
    const res = await request('GET', '/api/users/1/posts');
    assert.strictEqual(res.status, 200);
    res.body.posts.forEach(post => {
      assert.strictEqual(post.author.id, '1');
    });
  });

  it('GET /api/search/hashtag searches by hashtag', async () => {
    const res = await request('GET', '/api/search/hashtag?tag=coding');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.posts));
  });

  it('DELETE /api/posts/:id deletes own post', async () => {
    // Create a post first
    const created = await request('POST', '/api/posts', {
      user_id: '1',
      text: 'Delete me'
    });
    const res = await request('DELETE', `/api/posts/${created.body.id}?user_id=1`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.deleted, true);
  });
});
