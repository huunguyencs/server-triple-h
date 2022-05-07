const request = require('supertest');
const app = require('../index.js');

describe('Comment Endpoints', () => {
  it('Get post comment', async () => {
    const res = await request(app)
      .get('/comment/post/625143e6f527ca13625ebb76')
      .send();
    expect(res.statusCode).toEqual(200);
  });

  it('Get tour comment', async () => {
    const res = await request(app)
      .get('/comment/tour/624169bf9a6eb2bfbb65ccd4')
      .send();
    expect(res.statusCode).toEqual(200);
  });
});

describe('Post Endpoints', () => {
  it('Get post', async () => {
    const res = await request(app).get('/post/625143e6f527ca13625ebb76').send();
    expect(res.statusCode).toEqual(200);
  });
});
