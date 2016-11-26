import { combineReducers } from 'redux'
import { modelReducer, formReducer } from 'react-redux-form';

import searchTermSuggesttionsReducer from './search/suggestionsReducer'
import searchResultReducer from './search/searchResultReducer';
import videoPlayerReducer from './search/videoPlayerReducer';

export const searchQueryInitialState = {
  text: '',
  startDate: null,
  startTime: null,
  endDate: null,
  endTime: null, 
  geoJson: null
}

const reducers = combineReducers({
  search: modelReducer('search', searchQueryInitialState),
  searchForm: formReducer('search', searchQueryInitialState),
  searchTermSuggesttions: searchTermSuggesttionsReducer,
  searchResult: searchResultReducer,
  player: videoPlayerReducer
});

export default reducers;
