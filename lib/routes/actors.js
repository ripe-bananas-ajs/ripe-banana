/* eslint-disable new-cap */
const router = require('express').Router();
const Actor = require('../models/actor');
const Film = require('../models/film');

router
  .post('/', (req, res, next) => {
    Actor.create(req.body)
      .then(actor => {
        return res.json(actor);
      })
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    return Promise.all([
      Film.find({ 'cast._id': req.params.id }).lean().select('title released'),
      Actor.findById(req.params.id).lean()
    ])
      .then(([films, actor]) => {
        actor = {
          ...actor,
          films
        };
        return res.json(actor);
      })
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Actor.find()
      .select('name')
      .then(actor => {
        return res.json(actor);
      })
      .catch(next);
  })


  .delete('/:id', (req, res, next) => {
    Film.exists({ 'cast.actor': req.params.id })
      .then(exists => {
        if(exists) throw {
          statusCode: 400,
          error: 'Cannot delete actor who is currently in a film'
        };
        return Actor.findByIdAndRemove(req.params.id);
      })
      .then(actor => {
        return res.json(actor);
      })
      .catch(next);
  });


module.exports = router;