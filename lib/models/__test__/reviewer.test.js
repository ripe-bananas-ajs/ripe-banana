const Reviewer = require('../reviewer');

describe('Reviewer Model', () => {

  it('valid model all properties', () => {
    
    const data = {
      name: 'Allison',
      company: 'Allison\'s Movie Reviews'
    }
  
    const reviewer = new Reviewer(data);
    const errors = reviewer.validateSync();
    expect(errors).toBeUndefined()

    const json = reviewer.toJSON();

    expect(json).toEqual({
      ...data,
      _id: expect.any(Object)
    });
  });


});