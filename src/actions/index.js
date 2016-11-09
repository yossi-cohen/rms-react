import fetch from 'isomorphic-fetch';
import * as types from '../constants/ActionTypes'

// user tests ==========================================================================================

export function changeName(name) {
  return {
    type: types.CHANGE_NAME,
    name
  };
}

export function changeAge(age) {
  return {
    type: types.CHANGE_AGE,
    age
  };
}

// fetchVideos test ==========================================================================================

function fetchVideosRequest() {
  return {
    type: types.FETCH_VIDEOS_REQUEST
  }
}

function fetchVideosSuccess(body) {
  return {
    type: types.FETCH_VIDEO_SUCCESS,
    body
  }
}

function fetchVideosFailure(ex) {
  return {
    type: types.FETCH_VIDEO_FAILURE,
    ex
  }
}

export function fetchVideos() {
  return dispatch => {
    dispatch(fetchVideosRequest())
    return fetch('http://localhost:3000/api/videos')
      .then(res => res.json())
      .then(json => dispatch(fetchVideosSuccess(json.body)))
      .catch(ex => dispatch(fetchVideosFailure(ex)));
  }
}
