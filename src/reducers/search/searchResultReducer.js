import * as types from 'actions/ActionTypes'
import initialState from './initialState'

export default function reducer(state = initialState.result, action) {
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
