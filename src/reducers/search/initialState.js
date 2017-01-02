const initialState = {
    query: {
        text: '',
        startDate: null,
        startTime: null,
        endDate: null,
        endTime: null,
        geoJson: null
    },

    result: {
        searching: false,
        videos: [],
        error: null
    }
}

export default initialState;
