/* eslint-disable new-cap */
const router = require('express').Router();
const Studio = require('../models/studio');

router
  .post('/', (req, res, next) => {
    Studio.create(req.body)
      .then(studio => {
        return res.json(studio);
      })
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Studio.find()
      .then(studio => {
        return res.json(studio);
      })
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Studio.findById(req.params.id)
      .then(studio => {
        return res.json(studio);
      })
      .catch(next);
  });

module.exports = router;