const RequiredString = {
  type: String,
  required: true
};

const RequiredDate = {
  type: Date,
  required: true
};

const RequiredNumber = {
  type: Number,
  required: true
};

const Required4DigitNum = {
  type: Number,
  required: true,
  min: 1000,
  max: 9999
};

module.exports = {
  RequiredString,
  RequiredDate,
  RequiredNumber,
  Required4DigitNum
};