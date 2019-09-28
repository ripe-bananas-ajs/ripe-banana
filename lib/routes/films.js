/* eslint-disable new-cap */
const router = require('express').Router();
const Film = require('../models/film');

router

  .post('/', (req, res, next) => {
    Film.create(req.body)
      .then(film => {
        return res.json(film);
      })
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Film.findById(req.params.id)
      .populate('studio', 'name')
      .populate('cast.actor', 'name')
      .then(film => res.json(film))
      .catch(next);
  })


  .get('/', (req, res, next) => {
    Film.find()
      .select('title released')
      .populate('studio', 'name')
      .then(film => {
        return res.json(film);
      })
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Film.findByIdAndRemove(req.params.id)
      .then(film => res.json(film))
      .catch(next);
  });
module.exports = router;