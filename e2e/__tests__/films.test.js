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
      expect(film).toMatchInlineSnapshot(
        {
          _id: expect.any(String),
          studio: expect.any(String),
          cast: [
            {
              _id: expect.any(String),
              actor: expect.any(String)
            }
          ]
        },
        `
        Object {
          "__v": 0,
          "_id": Any<String>,
          "cast": Array [
            Object {
              "_id": Any<String>,
              "actor": Any<String>,
              "role": "Billy",
            },
          ],
          "released": 1969,
          "studio": Any<String>,
          "title": "Some bad movie",
        }
      `
      );
    });
  });

  it('gets by id', () => {
    return postFilm(film).then(savedFilm => {
      return request
        .get(`/api/films/${savedFilm._id}`)
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchInlineSnapshot(
            {
              _id: expect.any(String),
              studio: expect.any(String),
              cast: [
                {
                  _id: expect.any(String),
                  actor: expect.any(String)
                }
              ]
            },
            `
            Object {
              "__v": 0,
              "_id": Any<String>,
              "cast": Array [
                Object {
                  "_id": Any<String>,
                  "actor": Any<String>,
                  "role": "Billy",
                },
              ],
              "released": 1969,
              "studio": Any<String>,
              "title": "Some bad movie",
            }
          `
          );
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
        const anyId = {
          _id: expect.any(String)
        };
        const matchFilm = {
          ...anyId,
          studio: anyId
        };
        expect(body.length).toBe(3);
        expect(body[0]).toMatchInlineSnapshot(
          matchFilm,
          `
          Object {
            "_id": Any<String>,
            "released": 1969,
            "studio": Object {
              "_id": Any<String>,
              "name": "Creepy Hollywood Studio Inc",
            },
            "title": "Some bad movie",
          }
        `
        );
      });
  });

  it('deletes a film', () => {
    return postFilm(film).then(film => {
      return request.delete(`/api/films/${film._id}`).expect(200);
    });
  });
});
