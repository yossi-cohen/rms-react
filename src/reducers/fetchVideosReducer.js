import * as types from '../constants/ActionTypes'

const initialState = {
  fetching: false,
  fetched: false,
  videos: [],
  error: null,
};

export default function videosReducer(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_VIDEOS_REQUEST: {
      return {...state, fetching: true }
    }
    case types.FETCH_VIDEOS_FAILURE: {
      return {...state, fetching: false, error: action.json }
    }
    case types.FETCH_VIDEOS_SUCCESS: {
      return {
        ...state,
        fetching: false,
        fetched: true,
        videos: action.json.map(function (v) {
          return v.title;
        }),
      }
    }
  }

  return state
};