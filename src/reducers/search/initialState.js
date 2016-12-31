const initialState = {
    query: {
        text: '',
        startDate: null,
        startTime: null,
        endDate: null,
        endTime: null,
        geoJson: null
    },

    suggestions: {
        fetching: false,
        videos: [],
        error: null
    },

    result: {
        searching: false,
        videos: [],
        error: null
    }
}

export default initialState;
