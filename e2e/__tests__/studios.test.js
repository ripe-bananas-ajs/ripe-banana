const request = require('../request');
const db = require('../db');

describe('studios api', () => {

  beforeEach(() => {
    return db.dropCollection('studios');
  });

  const data = {
    name: 'Creepy Hollywood Studio Inc',
    address: {
      city: 'HollyLand',
      state: 'Calirofnia',
      country: 'Merica'
    }
  };

  function postStudio(data) {
    return request
      .post('/api/studios')
      .send(data)
      .expect(200)
      .then(({ body }) => {
        return body;
      });
  }


  it('posts a studio', () => {
    return postStudio(data)
      .then(studio => {
        expect(studio).toEqual({
          _id: expect.any(String),
          __v: 0,
          ...data
        });
      });
  });

  it('get all of the studios', () => {
    return Promise.all([
      postStudio(data),
      postStudio(data),
      postStudio(data)
    ])
      .then(() => {
        return request
          .get('/api/studios')
          .expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toEqual(3);
      });
  });

  it('gets one studio by id', () => {
    return postStudio(data)
      .then(studio => {
        return request
          .get(`/api/studios/${studio._id}`)
          .expect(200);
      })
      .then(({ body }) => {
        expect(body).toEqual({
          _id: expect.any(String),
          __v: 0,
          ...data
        });
      });
  });

  it('deletes a studio', () => {
    return postStudio(data)
      .then(studio => {
        return request
          .delete(`/api/studios/${studio._id}`)
          .expect(200);
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


    return postFilm(film)
      .then(returnedFilm => {
        return request.delete(`/api/studios/${returnedFilm.studio}`)
          .expect(400);
      });
  });


});
