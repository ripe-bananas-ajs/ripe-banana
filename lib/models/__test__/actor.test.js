const Actor = require('../actor');

describe('Actor Model', () => {

  it('valid model all properties', () => {
    const data = {
      name: 'That Guy',
      dob: new Date('4/20/1969'),
      pob: 'Springfield'
    };

    const actor = new Actor(data);
    const errors = actor.validateSync();
    expect(errors).toBeUndefined();

    const json = actor.toJSON();

    expect(json).toEqual({
      ...data,
      _id: expect.any(Object)
    });

  });

  it('validates required properties', () => {
    const data = {};
    const actor = new Actor(data);
    const { errors } = actor.validateSync();
    expect(errors.name.kind).toBe('required');
  });


});


