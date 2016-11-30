import * as types from 'constants/ActionTypes'
import urljoin from 'url-join';
import config from '../../config';

// --------------------------------------------------------
// fetchVideos (suggestions for autocomplete)
// --------------------------------------------------------

export function fetchVideos() {
  return function (dispatch) {
    dispatch(fetchVideosRequest());
    return fetch(urljoin(config.BASE_URL, '/api/videos'))
      .then(res => res.json())
      .then(json => { dispatch(fetchVideosSuccess(json)) })
      .catch(ex => dispatch(fetchVideosFailure(ex)));
  }
}

function fetchVideosRequest() {
  return {
    type: types.FETCH_SUGGESTIONS_REQUEST
  }
}

function fetchVideosSuccess(json) {
  return {
    type: types.FETCH_SUGGESTIONS_SUCCESS,
    json
  }
}

function fetchVideosFailure(ex) {
  return {
    type: types.FETCH_SUGGESTIONS_FAILURE,
    ex
  }
}

// --------------------------------------------------------
// searchVideos
// --------------------------------------------------------

export function searchVideos(query) {
  return function (dispatch) {
    dispatch(searchVideosRequest());

    return fetch(urljoin(config.BASE_URL, '/api/search'), {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(query)
    })
      .then(res => res.json())
      .then(json => { dispatch(searchVideosSuccess(json)) })
      .catch(ex => dispatch(searchVideosFailure(ex)));
  }
}

function searchVideosRequest() {
  return {
    type: types.SEARCH_VIDEOS_REQUEST
  }
}

function searchVideosSuccess(json) {
  return {
    type: types.SEARCH_VIDEOS_SUCCESS,
    json
  }
}

function searchVideosFailure(ex) {
  return {
    type: types.SEARCH_VIDEOS_FAILURE,
    ex
  }
}
