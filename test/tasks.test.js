const request = require('supertest');
const createApp = require('../src/app');

describe('Tasks API', () => {
  const app = createApp();

  it('lists existing tasks', async () => {
    const res = await request(app).get('/tasks');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // TODO (candidate): add tests covering:
  // - POST /tasks actually returns the created task (not just an intermediate "queued" response)
  // - firing many concurrent POST /tasks requests never produces two tasks with the same id
  // - sending malformed JSON to POST/PUT returns a clean JSON error, not a crash or an HTML error page
  // - PUT /tasks/:id cannot be used to overwrite protected fields like `id` via the request body
  // - any Part 2 features you implement (validation, pagination, rate limiting, auth middleware)
});
