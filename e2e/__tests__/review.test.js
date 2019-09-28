const request = require('../request');
const db = require('../db');
const { ObjectId } = require('mongoose').Types;


describe('review api', () => {

  beforeEach(() => {
    return db.dropCollection('review');
  });

  it('post a review', () => {

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

    // post a film

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

    return postReview(reviewData)
      .then(review => {
        expect(review).toEqual({
          _id: expect.any(String),
          __v: 0,
          ...reviewData
        });
      });


    // get the id off of the film
    // post a reviewer
    // get the id off of the reviewer
    // post a review
    // where the reviewer === the id of the reviewer._id and film === film_.id


  });

});