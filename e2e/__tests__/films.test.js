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
          "_id": "5d8e9ccaa3fc1d12da2f88ce",
          "cast": Array [
            Object {
              "_id": "5d8e9ccaa3fc1d12da2f88cf",
              "actor": "5d8e9ccaa3fc1d12da2f88cc",
              "role": "Billy",
            },
          ],
          "released": 1969,
          "studio": "5d8e9ccaa3fc1d12da2f88cd",
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
              "_id": "5d8e9ccaa3fc1d12da2f88d2",
              "cast": Array [
                Object {
                  "_id": "5d8e9ccaa3fc1d12da2f88d3",
                  "actor": Object {
                    "_id": "5d8e9ccaa3fc1d12da2f88d0",
                    "name": "That Guy",
                  },
                  "role": "Billy",
                },
              ],
              "released": 1969,
              "studio": Object {
                "_id": "5d8e9ccaa3fc1d12da2f88d1",
                "name": "Creepy Hollywood Studio Inc",
              },
              "title": "Some bad movie",
            }
          `);
        });
    });
  });

  it('gets all films', () => {
    return Promise.all([postFilm(film), postFilm(film), postFilm(film)])
      .then(() => {
        return request.get('/api/films').expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(3);
        expect(body).toMatchInlineSnapshot(`
          Array [
            Object {
              "__v": 0,
              "_id": "5d8e9ccba3fc1d12da2f88d9",
              "cast": Array [
                Object {
                  "_id": "5d8e9ccba3fc1d12da2f88da",
                  "actor": Object {
                    "_id": "5d8e9ccaa3fc1d12da2f88d6",
                    "name": "That Guy",
                  },
                  "role": "Billy",
                },
              ],
              "released": 1969,
              "studio": Object {
                "_id": "5d8e9ccba3fc1d12da2f88d8",
                "name": "Creepy Hollywood Studio Inc",
              },
              "title": "Some bad movie",
            },
            Object {
              "__v": 0,
              "_id": "5d8e9ccba3fc1d12da2f88dc",
              "cast": Array [
                Object {
                  "_id": "5d8e9ccba3fc1d12da2f88dd",
                  "actor": Object {
                    "_id": "5d8e9ccaa3fc1d12da2f88d4",
                    "name": "That Guy",
                  },
                  "role": "Billy",
                },
              ],
              "released": 1969,
              "studio": Object {
                "_id": "5d8e9ccba3fc1d12da2f88d7",
                "name": "Creepy Hollywood Studio Inc",
              },
              "title": "Some bad movie",
            },
            Object {
              "__v": 0,
              "_id": "5d8e9ccba3fc1d12da2f88de",
              "cast": Array [
                Object {
                  "_id": "5d8e9ccba3fc1d12da2f88df",
                  "actor": Object {
                    "_id": "5d8e9ccaa3fc1d12da2f88d4",
                    "name": "That Guy",
                  },
                  "role": "Billy",
                },
              ],
              "released": 1969,
              "studio": Object {
                "_id": "5d8e9ccba3fc1d12da2f88db",
                "name": "Creepy Hollywood Studio Inc",
              },
              "title": "Some bad movie",
            },
          ]
        `);
      });
  });

  it('deletes a film', () => {
    return postFilm(film).then(film => {
      return request.delete(`/api/films/${film._id}`).expect(200);
    });
  });
});
