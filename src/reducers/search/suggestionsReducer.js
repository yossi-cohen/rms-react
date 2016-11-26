import * as types from 'constants/ActionTypes'
import initialState from './initialState'

export default function reducer(state = initialState.suggestions, action) {
  switch (action.type) {
    case types.FETCH_SUGGESTIONS_REQUEST:
      return {...state, fetching: true, error: null }
    case types.FETCH_SUGGESTIONS_FAILURE:
      return {...state, fetching: false, error: action.json }
    case types.FETCH_SUGGESTIONS_SUCCESS:
      return {
          ...state,
        fetching: false,
        videos: action.json.map(function (v) {
          return v.title;
        })
      }
  }

  return state;
}
