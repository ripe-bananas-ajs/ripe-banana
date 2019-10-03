const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString } = require('./required-types');

const schema = new Schema({
  name: RequiredString,
  dob: Date,
  pob: String
});

module.exports = mongoose.model('Actor', schema);