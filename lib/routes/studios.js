/* eslint-disable new-cap */
const router = require('express').Router();
const Studio = require('../models/studio');
const Film = require('../models/film');

router
  .post('/', (req, res, next) => {
    Studio.create(req.body)
      .then(studio => {
        return res.json(studio);
      })
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    console.log(req.params.id);
    return Promise.all([
      Film.find({ studio: req.params.id }).lean().select('title'),
      Studio.findById(req.params.id).lean()
    ])
      .then(([films, studio]) => {
        studio = {
          ...studio,
          films
        };
        return res.json(studio);
      })
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Studio.find()
      .select('name')
      .then(studio => {
        return res.json(studio);
      })
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Film.exists({ 'studio': req.params.id })
      .then(exists => {
        if(exists) throw {
          statusCode: 400,
          error: 'Cannot delete studio with films ya dummy'
        };
        return Studio.findByIdAndRemove(req.params.id);
      })
      .then(studio => {
        return res.json(studio);
      })
      .catch(next);
  });

module.exports = router;