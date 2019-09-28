const request = require('../request');
const db = require('../db');

describe('review api', () => {

  beforeEach(() => {
    return db.dropCollection('review');
  });

  it('post a review', () => {

    const review = {
      rating: 4,
      reviewer: '',
      review: 'This movie gave me scabies',
      film: ''
    };


  });

});