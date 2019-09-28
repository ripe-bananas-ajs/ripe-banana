const request = require('../request');
const db = require('../db');
const { ObjectId } = require('mongoose').Types;

describe('review api', () => {
  beforeEach(() => {
    return db.dropCollection('reviews');
  });

  const reviewData = {
    rating: 4,
    reviewer: '',
    review: 'This movie gave me scabies',
    film: ''
  };

  const reviewer = {
    name: 'Joe',
    company: `Joe's All American Pie and Movie Review Shack`
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

  const data = {
    rating: 4,
    reviewer: 'billy',
    review: 'die laughing and crying with poo in mouth',
    film: 'the lego movie'
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
          .expect(200)
          .then(({ body }) => {
            review.reviewer = body._id;
            return request
              .post('/api/reviews')
              .send(review)
              .expect(200);
          });
      })
      .then(({ body }) => body);
  }

  it('post a review', () => {
    return postReview(reviewData).then(review => {
      expect(review).toEqual({
        _id: expect.any(String),
        __v: 0,
        ...reviewData
      });
    });
  });

  it('gets top rated 100 reviews', () => {
    return Promise.all([postReview(data), postReview(data)])
      .then(() => {
        return request.get('/api/reviews').expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(2);
        expect(body[0]).toMatchInlineSnapshot(`
          Object {
            "__v": 0,
            "_id": "5d8eb64e8835d81fcb2c277d",
            "film": "5d8eb64e8835d81fcb2c2777",
            "rating": 4,
            "review": "die laughing and crying with poo in mouth",
            "reviewer": "5d8eb64e8835d81fcb2c277b",
          }
        `);
      });
  });
});
