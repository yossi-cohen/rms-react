import * as urls from '../constants/urls'
import * as types from '../constants/ActionTypes'

export function searchVideos(query) {
  console.log('lilox: submit - ', query);
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
  //lilox
  console.log('lilox: searchVideosSuccess', json);
  
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
