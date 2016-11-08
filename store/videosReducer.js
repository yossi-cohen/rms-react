const reducer = (state = [], action) => {
    switch (action.type) {
        case 'CHANGE_VIDEOS':
            console.log(action.payload);
            state = {...state, videos: action.payload};
            break;

        case 'ADD_VIDEO':
            return state.videos.concat(action.payload);
            break;
    }

    return state;
};

export default reducer;
