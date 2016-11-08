const reducer = (state = [], action) => {
    switch (action.type) {
        case 'CHANGE_VIDEOS':
            state = [...action.payload];
            break;

        case 'ADD_VIDEO':
            return [
                ...state,
                action.payload
            ];
            break;
    }

    return state;
};

export default reducer;
