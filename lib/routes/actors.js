/* eslint-disable new-cap */
const router = require('express').Router();
const Actor = require('../models/actor');

router
  .post('/', (req, res, next) => {
    Actor.create(req.body)
      .then(actor => {
        return res.json(actor);
      })
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Actor.find()
      .then(actor => {
        return res.json(actor);
      })
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Actor.findById(req.params.id)
      .then(actor => {
        return res.json(actor);
      })
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Actor.findByIdAndRemove(req.params.id)
      .then(actor => {
        return res.json(actor);
      })
      .catch(next);
  });


module.exports = router;