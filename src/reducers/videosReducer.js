import * as types from '../constants/ActionTypes'

const initialState = {
  fetching: false,
  fetched: false,
  videos: [],
  error: null,
};

const reducer = (state = initialState, action) => {
console.log('lilox :--------------------------------------------------: VideosReducer: ');
console.log(action.type);
  switch (action.type) {
    case types.FETCH_VIDEOS_REQUEST: {
      return {...state, fetching: true}
    }
    case types.FETCH_VIDEOS_FAILURE: {
      return {...state, fetching: false, error: action.payload}
    }
    case types.FETCH_VIDEOS_SUCCESS: {
console.log('lilox :--------------------------------------------------: FETCH_VIDEOS_SUCCESS: ');
console.log(action);
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
