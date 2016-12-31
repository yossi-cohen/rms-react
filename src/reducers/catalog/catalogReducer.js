import * as types from 'actions/ActionTypes'

const initialState = {
    fetching: false,
    videos: [],
    error: null
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_CATALOG_REQUEST:
      return {...state, fetching: true, error: null }
    case types.FETCH_CATALOG_FAILURE:
      return {...state, fetching: false, error: action.json }
    case types.FETCH_CATALOG_SUCCESS:
      return {
          ...state,
        fetching: false,
        videos: action.json
      }
  }

  return state;
}
