import * as types from 'actions/ActionTypes'
import urljoin from 'url-join';
import config from '../../config';

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
