const request = require('../request');
const db = require('../db');

describe('actor api', () => {

  beforeEach(() => {
    return db.dropCollection('actors');
  });


  const actor = {
    name: 'joe',
    dob: new Date('4/20/1860'),
    pob: 'Springfield'
  };

  function postActor(actor) {
    return request
      .post('/api/actors')
      .send(actor)
      .expect(200)
      .then(({ body }) => {
        return body;
      });
  }

  it('posts an actor', () => {
    return postActor(actor)
      .then(actor => {
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
        return request
          .get('/api/actors')
          .expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(3);
      });
  });

  it('gets actor by id', () => {
    return postActor(actor)
      .then(actor => {
        return request
          .get(`/api/actors/${actor._id}`)
          .expect(200)
          .then(({ body }) => {
            expect(body).toEqual({
              _id: expect.any(String),
              __v: 0,
              ...actor
            });
          });
      });
  });

  it('deletes an actor', () => {
    return postActor(actor)
      .then(actor => {
        return request.delete(`/api/actors/${actor._id}`)
          .expect(200);
      });
  });

});