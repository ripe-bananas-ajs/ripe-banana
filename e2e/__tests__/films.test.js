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
          "_id": "5d8e8c1620446f5fd8268aa4",
          "cast": Array [
            Object {
              "_id": "5d8e8c1620446f5fd8268aa5",
              "actor": "5d8e8c1620446f5fd8268aa2",
              "role": "Billy",
            },
          ],
          "released": 1969,
          "studio": "5d8e8c1620446f5fd8268aa3",
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
              "_id": "5d8e8c1620446f5fd8268aa8",
              "cast": Array [
                Object {
                  "_id": "5d8e8c1620446f5fd8268aa9",
                  "actor": Object {
                    "_id": "5d8e8c1620446f5fd8268aa6",
                    "name": "That Guy",
                  },
                  "role": "Billy",
                },
              ],
              "released": 1969,
              "studio": Object {
                "_id": "5d8e8c1620446f5fd8268aa7",
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
              "_id": "5d8e8c1620446f5fd8268aaf",
              "cast": Array [
                Object {
                  "_id": "5d8e8c1620446f5fd8268ab0",
                  "actor": Object {
                    "_id": "5d8e8c1620446f5fd8268aab",
                    "name": "That Guy",
                  },
                  "role": "Billy",
                },
              ],
              "released": 1969,
              "studio": Object {
                "_id": "5d8e8c1620446f5fd8268aae",
                "name": "Creepy Hollywood Studio Inc",
              },
              "title": "Some bad movie",
            },
            Object {
              "__v": 0,
              "_id": "5d8e8c1620446f5fd8268ab2",
              "cast": Array [
                Object {
                  "_id": "5d8e8c1620446f5fd8268ab3",
                  "actor": Object {
                    "_id": "5d8e8c1620446f5fd8268aaa",
                    "name": "That Guy",
                  },
                  "role": "Billy",
                },
              ],
              "released": 1969,
              "studio": Object {
                "_id": "5d8e8c1620446f5fd8268aad",
                "name": "Creepy Hollywood Studio Inc",
              },
              "title": "Some bad movie",
            },
            Object {
              "__v": 0,
              "_id": "5d8e8c1620446f5fd8268ab4",
              "cast": Array [
                Object {
                  "_id": "5d8e8c1620446f5fd8268ab5",
                  "actor": Object {
                    "_id": "5d8e8c1620446f5fd8268aaa",
                    "name": "That Guy",
                  },
                  "role": "Billy",
                },
              ],
              "released": 1969,
              "studio": Object {
                "_id": "5d8e8c1620446f5fd8268ab1",
                "name": "Creepy Hollywood Studio Inc",
              },
              "title": "Some bad movie",
            },
          ]
        `);
      });
  });
});
