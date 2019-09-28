const request = require('../request');
const db = require('../db');

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
          "_id": "5d8ea93e2e14bc6bbe3bd677",
          "cast": Array [
            Object {
              "_id": "5d8ea93e2e14bc6bbe3bd678",
              "actor": "5d8ea93e2e14bc6bbe3bd675",
              "role": "Billy",
            },
          ],
          "released": 1969,
          "studio": "5d8ea93e2e14bc6bbe3bd676",
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
              "_id": "5d8ea93e2e14bc6bbe3bd67b",
              "cast": Array [
                Object {
                  "_id": "5d8ea93e2e14bc6bbe3bd67c",
                  "actor": Object {
                    "_id": "5d8ea93e2e14bc6bbe3bd679",
                    "name": "That Guy",
                  },
                  "role": "Billy",
                },
              ],
              "released": 1969,
              "studio": Object {
                "_id": "5d8ea93e2e14bc6bbe3bd67a",
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
              "_id": "5d8ea2c138ea4a431e2f488e",
              "cast": Array [
                Object {
                  "_id": "5d8ea2c138ea4a431e2f488f",
                  "actor": Object {
                    "_id": "5d8ea2c138ea4a431e2f488a",
                    "name": "That Guy",
                  },
                  "role": "Billy",
                },
              ],
              "released": 1969,
              "studio": Object {
                "_id": "5d8ea2c138ea4a431e2f488d",
                "name": "Creepy Hollywood Studio Inc",
              },
              "title": "Some bad movie",
            },
            Object {
              "__v": 0,
              "_id": "5d8ea2c138ea4a431e2f4891",
              "cast": Array [
                Object {
                  "_id": "5d8ea2c138ea4a431e2f4892",
                  "actor": Object {
                    "_id": "5d8ea2c138ea4a431e2f4889",
                    "name": "That Guy",
                  },
                  "role": "Billy",
                },
              ],
              "released": 1969,
              "studio": Object {
                "_id": "5d8ea2c138ea4a431e2f488c",
                "name": "Creepy Hollywood Studio Inc",
              },
              "title": "Some bad movie",
            },
            Object {
              "__v": 0,
              "_id": "5d8ea2c138ea4a431e2f4893",
              "cast": Array [
                Object {
                  "_id": "5d8ea2c138ea4a431e2f4894",
                  "actor": Object {
                    "_id": "5d8ea2c138ea4a431e2f4889",
                    "name": "That Guy",
                  },
                  "role": "Billy",
                },
              ],
              "released": 1969,
              "studio": Object {
                "_id": "5d8ea2c138ea4a431e2f4890",
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
