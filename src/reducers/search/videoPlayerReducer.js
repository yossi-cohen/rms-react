import * as types from 'constants/ActionTypes'
import initialState from './initialState'

const reducer = (state = initialState.player, action) => {
    switch (action.type) {
        case types.PLAY_VIDEO:
            return {...state, video: action.video};
        case types.STOP_VIDEO:
            return {...state, video: action.video};
    }

    return state;
};

export default reducer;
