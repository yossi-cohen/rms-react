import * as types from '../constants/ActionTypes'

export const initialState = {
  text: '',
  startDate: null,
  startTime: null,
  endDate: null,
  endTime: null,
  fetching: false,
  searching: false,
  suggestions: [],
  result: [],
  error: null
}

class SearchReducer {
  reducer(state = initialState, action) {
    switch (action.type) {
      // fetch
      case types.FETCH_VIDEOS_REQUEST: {
        return {...state, fetching: true, error: null }
      }
      case types.FETCH_VIDEOS_FAILURE: {
        return {...state, fetching: false, error: action.json }
      }
      case types.FETCH_VIDEOS_SUCCESS: {
        return {
                ...state,
          fetching: false,
          suggestions: action.json.map(function (v) {
            return v.title;
          }),
        }
      }

      // search
      case types.SEARCH_VIDEOS_REQUEST: {
        return {...state, searching: true, error: null }
      }
      case types.SEARCH_VIDEOS_FAILURE: {
        return {...state, searching: false, error: action.json }
      }
      case types.SEARCH_VIDEOS_SUCCESS: {
        return {
          ...state,
          searching: false,
          result: action.json
        }
      }
    }

    return state;
  }
}

let searchReducer = new SearchReducer();
export default searchReducer;
