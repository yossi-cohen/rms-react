import * as types from '../constants/ActionTypes'

const initialState = {
  fetching: false,
  fetched: false,
  videos: [],
  error: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_VIDEOS_REQUEST: {
      return {...state, fetching: true}
    }
    case types.FETCH_TODOS_FAILURE: {
      return {...state, fetching: false, error: action.payload}
    }
    case types.FETCH_TODOS_SUCCESS: {
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
