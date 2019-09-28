const Review = require('../review');
const { ObjectId } = require('mongoose').Types;

describe('review model', () => {

  it('valid model of all properties', () => {
    const data = {
      rating: 4,
      reviewer: new ObjectId(),
      review: 'This movie gave me scabies',
      film: new ObjectId()
    };

    const review = new Review(data);
    const errors = review.validateSync();
    expect(errors).toBeUndefined();

    const json = review.toJSON();

    expect(json).toEqual({
      ...data,
      _id: expect.any(Object)
    });


  });
});