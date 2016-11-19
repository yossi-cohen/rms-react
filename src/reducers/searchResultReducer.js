import * as types from '../constants/ActionTypes'

const initialState = {
  fetching: false,
  fetched: false,
  videos: [],
  error: null,
};

export default function searchResultReducer(state = initialState, action) {
  switch (action.type) {
    case types.SEARCH_VIDEOS_REQUEST: {
      return {...state, fetching: true }
    }
    case types.SEARCH_VIDEOS_FAILURE: {
      return {...state, fetching: false, error: action.json }
    }
    case types.SEARCH_VIDEOS_SUCCESS: {
      return {
        ...state,
        fetching: false,
        fetched: true,
        videos: action.json
      }
    }
  }

  return state
};
