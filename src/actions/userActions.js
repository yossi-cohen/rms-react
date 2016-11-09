export function changeName(name) {
  return {
    type: 'CHANGE_NAME',
    name
  };
}

export function changeAge(age) {
  return {
    type: 'CHANGE_AGE',
    age
  };
}
