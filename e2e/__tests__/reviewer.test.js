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

  function postReviewer(reviewer) {
    return request
      .post('/api/reviewers')
      .send(reviewer)
      .expect(200)
      .then(({ body }) => body);
  }

  it('post a reviewer', () => {
    return postReviewer(data)
      .then(reviewer => {
        expect(reviewer).toEqual({
          _id: expect.any(String),
          __v: 0,
          ...data
        });
      });
  });

  it('gets all reviewers', () => {
    return Promise.all([
      postReviewer({ name: 'joe', company: 'joe co' }),
      postReviewer({ name: 'sam', company: 'sam co' }),
    ])
      .then(() => {
        return request 
          .get('/api/reviewers')
          .expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(2);
        expect(body[0]).toEqual({
          _id: expect.any(String),
          __v: 0,
          name: 'joe',
          company: 'joe co'
        });
      });
  });


  it('gets reviewer by id', () => {
    return postReviewer(data)
      .then(reviewer => {
        console.log(reviewer);
        return request
          .get(`/api/reviewers/${reviewer._id}`)
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

});