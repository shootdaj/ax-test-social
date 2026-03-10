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

describe('Users API', () => {
  before(async () => {
    // Clear module cache to get fresh store
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

  it('GET /api/health returns 200', async () => {
    const res = await request('GET', '/api/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'ok');
  });

  it('GET /api/users returns 5 seeded users', async () => {
    const res = await request('GET', '/api/users');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.users.length, 5);
  });

  it('GET /api/users/:id returns a user with stats', async () => {
    const res = await request('GET', '/api/users/1');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.username, 'alexchen');
    assert.ok('follower_count' in res.body);
    assert.ok('following_count' in res.body);
    assert.ok('post_count' in res.body);
  });

  it('GET /api/users/:id returns 404 for missing user', async () => {
    const res = await request('GET', '/api/users/999');
    assert.strictEqual(res.status, 404);
  });

  it('POST /api/users creates a new user', async () => {
    const res = await request('POST', '/api/users', {
      username: 'testuser',
      display_name: 'Test User',
      bio: 'Just testing'
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.username, 'testuser');
    assert.ok(res.body.id);
  });

  it('POST /api/users rejects duplicate username', async () => {
    const res = await request('POST', '/api/users', {
      username: 'alexchen',
      display_name: 'Duplicate Alex'
    });
    assert.strictEqual(res.status, 409);
  });

  it('POST /api/users rejects missing fields', async () => {
    const res = await request('POST', '/api/users', {});
    assert.strictEqual(res.status, 400);
  });

  it('GET /api/search/users finds users by username', async () => {
    const res = await request('GET', '/api/search/users?q=alex');
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.users.length > 0);
    assert.ok(res.body.users.some(u => u.username === 'alexchen'));
  });

  it('GET /api/search/users finds users by display name', async () => {
    const res = await request('GET', '/api/search/users?q=Sarah');
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.users.some(u => u.username === 'sarahwave'));
  });

  it('POST /api/users/:id/follow creates follow relationship', async () => {
    const res = await request('POST', '/api/users/3/follow', { user_id: '2' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.following, true);
  });

  it('DELETE /api/users/:id/follow removes follow relationship', async () => {
    const res = await request('DELETE', '/api/users/3/follow?user_id=2');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.following, false);
  });

  it('POST /api/users/:id/follow rejects self-follow', async () => {
    const res = await request('POST', '/api/users/1/follow', { user_id: '1' });
    assert.strictEqual(res.status, 400);
  });

  it('GET /api/users/:id/followers returns followers', async () => {
    const res = await request('GET', '/api/users/1/followers');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.users));
  });

  it('GET /api/users/:id/following returns following', async () => {
    const res = await request('GET', '/api/users/1/following');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.users));
  });

  it('GET /api/users/:id/follow/status checks follow status', async () => {
    const res = await request('GET', '/api/users/2/follow/status?user_id=1');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(typeof res.body.following, 'boolean');
  });
});
