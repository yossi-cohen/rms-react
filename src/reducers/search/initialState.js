const initialState = {
    query: {
        text: '',
        startDate: null,
        startTime: null,
        endDate: null,
        endTime: null,
        cesium: {
            geoJson: null,
        }
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
    },

    player: {
        video: null
    }
}

export default initialState;
