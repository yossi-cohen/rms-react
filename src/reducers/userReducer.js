import * as types from '../constants/ActionTypes'

const reducer = (state = {}, action) => {
    switch (action.type) {
        case types.CHANGE_NAME:
            return {...state, name: action.payload};
        case types.CHANGE_AGE:
            return {...state, age: action.payload};
    }

    return state;
};

export default reducer;
