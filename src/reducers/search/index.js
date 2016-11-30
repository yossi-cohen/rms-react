import { combineReducers } from 'redux'
import { modelReducer, formReducer } from 'react-redux-form';
import searchTermSuggestionsReducer from './suggestionsReducer'
import updateGeoJsonReducer from './updateGeoJsonReducer'
import searchResultReducer from './searchResultReducer';
import videoPlayerReducer from './videoPlayerReducer';
import initialState from './initialState'

const reducers = combineReducers({
  query: modelReducer('query', initialState.query),
  queryForm: formReducer('query', initialState.query),
  suggestions: searchTermSuggestionsReducer,
  result: searchResultReducer,
  player: videoPlayerReducer
});

export default reducers;
