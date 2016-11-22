import * as urls from 'constants/urls'
import * as types from 'constants/ActionTypes'

// --------------------------------------------------------
// fetchVideos
// --------------------------------------------------------

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

// --------------------------------------------------------
// searchVideos
// --------------------------------------------------------

export function searchVideos(query) {
  return function (dispatch) {
    dispatch(searchVideosRequest());

    return fetch(urls.postVideoSearch, {
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
