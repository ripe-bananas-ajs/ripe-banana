/* eslint-disable new-cap */
const router = require('express').Router();
const Reviewer = require('../models/reviewer');
const Review = require('../models/review');

router
  .post('/', (req, res, next) => {
    Reviewer.create(req.body)
      .then(reviewer => {
        return res.json(reviewer);
      })
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    return Promise.all([
      Reviewer.findById(req.params.id).lean(),
      Review.find({ 'reviewer': req.params.id })
        .lean()
        .populate('film', 'title')
        .select('title rating review')
    ])
      .then(([reviewer, reviews]) => {
        const result = {
          ...reviewer,
          reviews 
        };
        return res.json(result);
      })
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Reviewer.find()
      .select('name company')
      .then(reviewer => res.json(reviewer))
      .catch(next);
  })

  .put('/:id', ({ params, body }, res, next) => {
    Reviewer.updateById(params.id, body)
      .then(reviewer => res.json(reviewer))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Reviewer.findByIdAndRemove(req.params.id)
      .then(reviewer => res.json(reviewer))
      .catch(next);
  });

module.exports = router;