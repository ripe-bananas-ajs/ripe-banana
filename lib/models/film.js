const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString, Required4DigitNum } = require('./required-types');
const { ObjectId } = Schema.Types;

const schema = new Schema({
  title: RequiredString,
  studio: { 
    type: ObjectId,
    ref: 'Studio',
    required: true
  },
  released: Required4DigitNum,
  cast: [{
    role: String,
    actor: {
      type: ObjectId,
      ref: 'Actor',
      required: true
    }
  }]
});

module.exports = mongoose.model('Film', schema);