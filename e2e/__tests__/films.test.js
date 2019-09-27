const request = require('../request');
const db = require('../db');
// const { ObjectId } = require('mongoose').Types;

describe('film api', () => {
  beforeEach(() => {
    return Promise.all([
      db.dropCollection('films'),
      db.dropCollection('actors'),
      db.dropCollection('studios')
    ]);
  });

  const actor = {
    name: 'That Guy',
    dob: new Date('4/20/1969'),
    pob: 'Springfield'
  };

  const studio = {
    name: 'Creepy Hollywood Studio Inc',
    address: {
      city: 'HollyLand',
      state: 'Calirofnia',
      country: 'Merica'
    }
  };

  const film = {
    title: 'Some bad movie',
    studio: '',
    released: 1969,
    cast: [
      {
        role: 'Billy'
      }
    ]
  };

  function postFilm(film) {
    return request
      .post('/api/actors')
      .send(actor)
      .expect(200)
      .then(({ body }) => {
        film.cast[0].actor = body._id;
        return request
          .post('/api/studios')
          .send(studio)
          .expect(200)
          .then(({ body }) => {
            film.studio = body._id;
            return request
              .post('/api/films')
              .send(film)
              .expect(200);
          });
      })
      .then(({ body }) => body);
  }

  it('posting a film', () => {
    return postFilm(film).then(film => {
      expect(film).toMatchInlineSnapshot(`
        Object {
          "__v": 0,
          "_id": "5d8e84208c930c12da7cd413",
          "cast": Array [
            Object {
              "_id": "5d8e84208c930c12da7cd414",
              "actor": "5d8e84208c930c12da7cd411",
              "role": "Billy",
            },
          ],
          "released": 1969,
          "studio": "5d8e84208c930c12da7cd412",
          "title": "Some bad movie",
        }
      `);
    });
  });

  it('gets by id', () => {
    return postFilm(film).then(savedFilm => {
      return request
        .get(`/api/films/${savedFilm._id}`)
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchInlineSnapshot(`
            Object {
              "__v": 0,
              "_id": "5d8e84208c930c12da7cd417",
              "cast": Array [
                Object {
                  "_id": "5d8e84208c930c12da7cd418",
                  "actor": "5d8e84208c930c12da7cd415",
                  "role": "Billy",
                },
              ],
              "released": 1969,
              "studio": "5d8e84208c930c12da7cd416",
              "title": "Some bad movie",
            }
          `);
        });
    });
  });
});
