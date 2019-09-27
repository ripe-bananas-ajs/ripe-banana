const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString } = require('./required-types');

const schema = new Schema({
  name: RequiredString,
  address: {
    city: String,
    state: String,
    country: String
  }
});

module.exports = mongoose.model('Studio', schema);