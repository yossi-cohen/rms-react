import * as types from 'actions/ActionTypes'

const initialState = {
    video: null
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.PLAY_VIDEO:
            return { ...state, video: action.video };
        case types.STOP_VIDEO:
            return { ...state, video: action.video };
    }

    return state;
};

export default reducer;
