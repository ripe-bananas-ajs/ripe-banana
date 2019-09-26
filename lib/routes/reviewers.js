/* eslint-disable new-cap */
const router = require('express').Router();
const Reviewer = require('../models/reviewer');

router
  .post('/', (req, res, next) => {
    Reviewer.create(req.body)
      .then(reviewer => {
        return res.json(reviewer);
      })
      .catch(next);
  })
 
  .get('/:id', (req, res, next) => {
    Reviewer.findById(req.params.id)
      .then(reviewer => res.json(reviewer))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Reviewer.find()
      .then(reviewer => res.json(reviewer))
      .catch(next);
  })

  .put('/:id', ({ params, body }, res, next) => {
    Reviewer.updateById(params.id, body)
      .then(reviewer => res.json(reviewer))
      .catch(next);
  });


module.exports = router;