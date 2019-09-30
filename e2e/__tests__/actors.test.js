const request = require('../request');
const db = require('../db');

describe('actor api', () => {
  beforeEach(() => {
    return db.dropCollection('actors');
  });

  function postActor(actor) {
    return request
      .post('/api/actors')
      .send(actor)
      .expect(200)
      .then(({ body }) => {
        return body;
      });
  }

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
          .expect(200);
      })
      .then(({ body }) => {
        film.studio = body._id;
        return request
          .post('/api/films')
          .send(film)
          .expect(200);
      })
      .then(({ body }) => body);
  }

  const actor = {
    name: 'joe',
    dob: new Date('4/20/1860'),
    pob: 'Springfield'
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

  const studio = {
    name: 'Creepy Hollywood Studio Inc',
    address: {
      city: 'HollyLand',
      state: 'Calirofnia',
      country: 'Merica'
    }
  };

  it('posts an actor', () => {
    return postActor(actor).then(actor => {
      expect(actor).toEqual({
        _id: expect.any(String),
        __v: 0,
        ...actor
      });
    });
  });

  it('gets all actors', () => {
    return Promise.all([
      postActor({ name: 'actor', dob: new Date('4/20/1860'), pob: 'hello' }),
      postActor({ name: 'hello', dob: new Date('4/20/1860'), pob: 'hello' }),
      postActor({ name: 'newthing', dob: new Date('4/20/1860'), pob: 'hello' })
    ])
      .then(() => {
        return request.get('/api/actors').expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(3);
      });
  });

  it('gets actor by id', () => {
    return postActor(actor).then(returnedActor => {
      film.cast[0] = {
        _id: returnedActor._id
      };
      return postFilm(film)
        .then(() => {
          return request.get(`/api/actors/${returnedActor._id}`).expect(200);
        })
        .then(({ body }) => {
          expect(body).toMatchInlineSnapshot(
            {
              _id: expect.any(String),
              dob: expect.any(String),
              films: [
                {
                  _id: expect.any(String)
                }
              ]
            },
            `
            Object {
              "__v": 0,
              "_id": Any<String>,
              "dob": Any<String>,
              "films": Array [
                Object {
                  "_id": Any<String>,
                  "released": 1969,
                  "title": "Some bad movie",
                },
              ],
              "name": "joe",
              "pob": "Springfield",
            }
          `
          );
        });
    });
  });

  it('deletes an actor', () => {
    return postActor(actor).then(actor => {
      return request.delete(`/api/actors/${actor._id}`).expect(200);
    });
  });

  it('will not delete an actor in a movie', () => {
    return postFilm(film).then(returnedFilm => {
      return request
        .delete(`/api/actors/${returnedFilm.cast[0].actor}`)
        .expect(400);
    });
  });
});
