const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const schema = new Schema({
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  reviewer: {
    type: ObjectId,
    ref: 'Reviewer',
    required: true
  },
  review: {
    type: String,
    required: true,
    min: 1,
    max: 140
  },
  film: {
    type: ObjectId,
    ref: 'Film',
    required: true
  }
});

module.exports = mongoose.model('Reviews', schema);