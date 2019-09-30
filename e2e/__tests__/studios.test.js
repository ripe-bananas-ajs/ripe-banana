const request = require('../request');
const db = require('../db');

describe('studios api', () => {
  beforeEach(() => {
    return db.dropCollection('studios');
  });

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

  let film = {
    title: 'Some bad movie',
    studio: {},
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

  function postStudio(studio) {
    return request
      .post('/api/studios')
      .send(studio)
      .expect(200)
      .then(({ body }) => {
        return body;
      });
  }

  it('posts a studio', () => {
    return postStudio(studio).then(studio => {
      expect(studio).toEqual({
        _id: expect.any(String),
        __v: 0,
        ...studio
      });
    });
  });

  it('get all of the studios', () => {
    return Promise.all([
      postStudio(studio),
      postStudio(studio),
      postStudio(studio)
    ])
      .then(() => {
        return request.get('/api/studios').expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toEqual(3);
      });
  });

  it('gets one studio by id', () => {
    return postFilm(film)
      .then(newFilm => {
        console.log(newFilm);
        return request.get(`/api/studios/${newFilm.studio}`).expect(200);
      })
      .then(({ body }) => {
        expect(body).toMatchInlineSnapshot(
          {
            _id: expect.any(String),
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
            "address": Object {
              "city": "HollyLand",
              "country": "Merica",
              "state": "Calirofnia",
            },
            "films": Array [
              Object {
                "_id": Any<String>,
                "title": "Some bad movie",
              },
            ],
            "name": "Creepy Hollywood Studio Inc",
          }
        `
        );
      });
  });

  it('deletes a studio', () => {
    return postStudio(studio).then(studio => {
      return request.delete(`/api/studios/${studio._id}`).expect(200);
    });
  });

  it('does not delete a studio with a film', () => {
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

    return postFilm(film).then(returnedFilm => {
      return request.delete(`/api/studios/${returnedFilm.studio}`).expect(400);
    });
  });
});
