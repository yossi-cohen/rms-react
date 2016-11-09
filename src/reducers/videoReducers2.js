//lilox
const reducer = (state = [], action) => {
    switch (action.type) {
        case 'UPDATE_VIDEOS':
            return [...action.payload];

        case 'ADD_VIDEO':
            return [
                ...state,
                action.payload
            ];
    }

    return state;
};
