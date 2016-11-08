const initialState = {
  fetching: false,
  fetched: false,
  videos: [],
  error: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_VIDEOS_PENDING": {
      return {...state, fetching: true}
    }
    case "FETCH_VIDEOS_REJECTED": {
      return {...state, fetching: false, error: action.payload}
    }
    case "FETCH_VIDEOS_FULFILLED": {
      return {
        ...state,
        fetching: false,
        fetched: true,
        videos: action.payload,
      }
    }
  }
  return state
};

export default reducer;
