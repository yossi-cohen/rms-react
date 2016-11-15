import axios from "axios";
//lilox:import fetch from 'isomorphic-fetch';
import * as types from '../constants/ActionTypes'

export function fetchVideos() {
  return function(dispatch) {
    dispatch(fetchVideosRequest())
    //lilox: 
    // return fetch('http://localhost:3000/api/videos')
    return axios.get('http://localhost:3000/api/videos')
      // .then(json => dispatch(fetchVideosSuccess(json.body.videos)))
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
