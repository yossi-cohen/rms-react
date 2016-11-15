import * as types from '../constants/ActionTypes'

export function changeName(name) {
  return {
    type: types.CHANGE_NAME,
    name
  };
}

export function changeAge(age) {
  return {
    type: types.CHANGE_AGE,
    age
  };
}
