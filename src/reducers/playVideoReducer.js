import * as types from '../constants/ActionTypes'

const reducer = (state = {}, action) => {
    switch (action.type) {
        case types.PLAY_VIDEO:
            return {...state, video: action.video};
    }

    return state;
};

export default reducer;
