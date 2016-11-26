import { combineReducers } from 'redux'
import { modelReducer, formReducer } from 'react-redux-form';
import searchTermSuggestionsReducer from './suggestionsReducer'
import searchResultReducer from './searchResultReducer';
import videoPlayerReducer from './videoPlayerReducer';
import initialState from './initialState'

const reducers = combineReducers({
  query: modelReducer('query', initialState),
  queryForm: formReducer('query', initialState),
  suggestions: searchTermSuggestionsReducer,
  result: searchResultReducer,
  player: videoPlayerReducer
});

export default reducers;
