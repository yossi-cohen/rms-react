import * as types from 'actions/ActionTypes'
import urljoin from 'url-join';
import config from '../../config';

// --------------------------------------------------------
// fetchCatalog
// --------------------------------------------------------

export function fetchCatalog() {
  return function (dispatch) {
    dispatch(fetchCatalogRequest());
    return fetch(urljoin(config.BASE_URL, '/api/catalog'))
      .then(res => res.json())
      .then(json => { dispatch(fetchCatalogSuccess(json)) })
      .catch(ex => dispatch(fetchCatalogFailure(ex)));
  }
}

function fetchCatalogRequest() {
  return {
    type: types.FETCH_CATALOG_REQUEST
  }
}

function fetchCatalogSuccess(json) {
  return {
    type: types.FETCH_CATALOG_SUCCESS,
    json
  }
}

function fetchCatalogFailure(ex) {
  return {
    type: types.FETCH_CATALOG_FAILURE,
    ex
  }
}
