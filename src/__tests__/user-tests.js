import * as actions from '../actions/userActions';
import * as types from '../constants/ActionTypes'

describe('actions', () => {
  it('should change name', () => {
    const name = 'lilo';
    const expectedAction = {
      type: types.CHANGE_NAME,
      name
    }
    expect(actions.changeName(name)).toEqual(expectedAction)
  })
});

describe('actions', () => {
  it('should change age', () => {
    const age = 50;
    const expectedAction = {
      type: types.CHANGE_AGE,
      age
    }
    expect(actions.changeAge(age)).toEqual(expectedAction)
  })
});
