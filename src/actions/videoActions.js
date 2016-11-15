import axios from "axios";

import * as types from '../constants/ActionTypes'

export function fetchVideos() {
  return function (dispatch) {
    dispatch(fetchVideosRequest())
      return axios.get('http://localhost:3000/api/videos')
      .then(res => dispatch(fetchVideosSuccess(res.data)))
      .catch(ex => dispatch(fetchVideosFailure(ex)));
  }
}

function fetchVideosRequest() {
  return {
    type: types.FETCH_VIDEOS_REQUEST
  }
}

function fetchVideosSuccess(body) {
  return {
    type: types.FETCH_VIDEOS_SUCCESS,
    body
  }
}

function fetchVideosFailure(ex) {
  return {
    type: types.FETCH_VIDEOS_FAILURE,
    ex
  }
}
