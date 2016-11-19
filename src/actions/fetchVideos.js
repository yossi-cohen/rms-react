import * as urls from '../constants/urls'
import * as types from '../constants/ActionTypes'

export function fetchVideos() {
  return function (dispatch) {
    dispatch(fetchVideosRequest());
    return fetch(urls.getVideoList)
      .then(res => res.json())
      .then(json => { dispatch(fetchVideosSuccess(json)) })
      .catch(ex => dispatch(fetchVideosFailure(ex)));
  }
}

function fetchVideosRequest() {
  return {
    type: types.FETCH_VIDEOS_REQUEST
  }
}

function fetchVideosSuccess(json) {
  return {
    type: types.FETCH_VIDEOS_SUCCESS,
    json
  }
}

function fetchVideosFailure(ex) {
  return {
    type: types.FETCH_VIDEOS_FAILURE,
    ex
  }
}
