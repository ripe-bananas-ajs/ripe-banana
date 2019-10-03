const request = require('../request');
const db = require('../db');
const { ObjectId } = require('mongoose').Types;

describe('reviewers api', () => {
  beforeEach(() => {
    return db.dropCollection('reviewers');
  });

  const reviewer = {
    name: 'Joe',
    company: `Joe's All American Pie and Movie Review Shack`
  };

  const review = {
    rating: 4,
    reviewer: '',
    review: 'This movie gave me scabies',
    film: ''
  };

  const film = {
    title: 'Some bad movie',
    studio: new ObjectId(),
    released: 1969,
    cast: [
      {
        role: 'Billy',
        actor: new ObjectId()
      }
    ]
  };

  function postReview(review) {
    return request
      .post('/api/films')
      .send(film)
      .expect(200)
      .then(({ body }) => {
        review.film = body._id;
        return request
          .post('/api/reviewers')
          .send(reviewer)
          .expect(200);
      })
      .then(({ body }) => {
        review.reviewer = body._id;
        return request
          .post('/api/reviews')
          .send(review)
          .expect(200);
      })
      .then(({ body }) => body);
  }

  function postReviewer(reviewer) {
    return request
      .post('/api/reviewers')
      .send(reviewer)
      .expect(200)
      .then(({ body }) => body);
  }

  it('post a reviewer', () => {
    return postReviewer(reviewer).then(reviewer => {
      expect(reviewer).toEqual({
        _id: expect.any(String),
        __v: 0,
        ...reviewer
      });
    });
  });

  it('gets all reviewers', () => {
    return Promise.all([
      postReviewer({ name: 'joe', company: 'joe co' }),
      postReviewer({ name: 'sam', company: 'sam co' })
    ])
      .then(() => {
        return request.get('/api/reviewers').expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(2);
        expect(body[0]).toEqual({
          _id: expect.any(String),
          name: 'joe',
          company: 'joe co'
        });
      });
  });

  it('gets reviewer by id', () => {
    return postReview(review)
      .then(body => {
        return request.get(`/api/reviewers/${body.reviewer}`).expect(200);
      })
      .then(({ body }) => {
        expect(body).toMatchInlineSnapshot(
          {
            _id: expect.any(String),
            reviews: [
              {
                _id: expect.any(String),
                film: {
                  _id: expect.any(String)
                }
              }
            ]
          },
          `
          Object {
            "__v": 0,
            "_id": Any<String>,
            "company": "Joe's All American Pie and Movie Review Shack",
            "name": "Joe",
            "reviews": Array [
              Object {
                "_id": Any<String>,
                "film": Object {
                  "_id": Any<String>,
                  "title": "Some bad movie",
                },
                "rating": 4,
                "review": "This movie gave me scabies",
              },
            ],
          }
        `
        );
      });
  });

  it('updates reviewer', () => {
    return postReviewer(reviewer)
      .then(reviewer => {
        reviewer.name = 'abbey';
        return request
          .put(`/api/reviewers/${reviewer._id}`)
          .send(reviewer)
          .expect(200);
      })
      .then(({ body }) => {
        expect(body.name).toBe('abbey');
      });
  });

  it('deletes a reviewer', () => {
    return postReviewer(reviewer).then(reviewer => {
      return request.delete(`/api/reviewers/${reviewer._id}`).expect(200);
    });
  });
});
