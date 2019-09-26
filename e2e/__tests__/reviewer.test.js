const request = require('../request');
const db = require('../db');

describe('reviewers api', () => {

  beforeEach(() => {
    return db.dropCollection('reviewers');
  });

  const data = {
    name: 'Joe',
    company: `Joe's All American Pie and Movie Review Shack`
  };

  it('post a reviewer', () => {
    return request
      .post('/api/reviewers')
      .send(data)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({
          _id: expect.any(String),
          __v: 0,
          ...data
        });
      });
  });

});