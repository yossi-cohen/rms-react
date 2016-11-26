import * as types from 'constants/ActionTypes'

const initialState = {
  searching: false,
  videos: [],
  error: null
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.SEARCH_VIDEOS_REQUEST:
      return {...state, searching: true, error: null }
    case types.SEARCH_VIDEOS_FAILURE:
      return {...state, searching: false, error: action.json }
    case types.SEARCH_VIDEOS_SUCCESS:
      return {...state, searching: false, videos: action.json }
  }

  return state;
}
