const request = require('../request');
const db = require('../db');
const { ObjectId } = require('mongoose').Types;

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

  it('posting a film', () => {
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
      .then(film => {
        expect(film.body).toMatchInlineSnapshot(`
          Object {
            "__v": 0,
            "_id": "5d8e80f5f3d4df0fdf9acfb2",
            "cast": Array [
              Object {
                "_id": "5d8e80f5f3d4df0fdf9acfb3",
                "actor": "5d8e80f5f3d4df0fdf9acfb0",
                "role": "Billy",
              },
            ],
            "released": 1969,
            "studio": "5d8e80f5f3d4df0fdf9acfb1",
            "title": "Some bad movie",
          }
        `);
      });
  });
});
