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
          .expect(200)
          .then(({ body }) => {
            expect(body).toEqual({
              _id: expect.any(String),
              __v: 0,
              ...data
            });
          });
      });
  });

  


});