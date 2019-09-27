const Film = require('../film');
const { ObjectId } = require('mongoose').Types;

describe('film', () => {

  it('valid model all properties', () => {
    const data = {
      title: 'That Movie',
      studio: new ObjectId(),
      released: 2000,
      cast: [{
        role: 'Billy',
        actor: new ObjectId(),
      }]
    };

    const film = new Film(data);
    const errors = film.validateSync();
    expect(errors).toBeUndefined();

    const json = film.toJSON();
    
    expect(json).toEqual({
      ...data,
      _id: expect.any(Object),
      studio: expect.any(Object),
      cast: [{
        _id: expect.any(Object),
        actor: expect.any(Object),
        ...data.cast[0]
      }]
    
    });

  });

  it('validates required properties', () => {
    const data = {
      cast: [{}]
    };
    const film = new Film(data);
    const { errors } = film.validateSync();
    expect(errors.title.kind).toBe('required');
    expect(errors.studio.kind).toBe('required');
    expect(errors.released.kind).toBe('required');
    expect(errors['cast.0.actor'].kind).toBe('required');
  });

});