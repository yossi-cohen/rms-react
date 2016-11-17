import axios from "axios";

import * as types from '../constants/ActionTypes'

export function fetchVideos() {
  return function (dispatch) {
    dispatch(fetchVideosRequest());

    //lilox
    let useAxios = false;
    
    if (useAxios) {
      return axios.get('http://localhost:3000/api/videos')
        .then(res => { dispatch(fetchVideosSuccess(res.data)) })
        .catch(ex => dispatch(fetchVideosFailure(ex)));
    }
    else {
      return fetch('http://localhost:3000/api/videos')
        .then((res) => res.json())
        .then((json) => { dispatch(fetchVideosSuccess(json)) })
        .catch(ex => dispatch(fetchVideosFailure(ex)));
    }
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
