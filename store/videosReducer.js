export const videosReducer = (state = [], action) => {
    switch (action.type) {
        case 'CHANGE_VIDEOS':
            state = {...state, videos: action.payload}
            break;
    }

    return state;
};
