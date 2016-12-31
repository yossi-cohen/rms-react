import { combineReducers } from 'redux'
import { modelReducer, formReducer } from 'react-redux-form';
import searchTermSuggestionsReducer from './suggestionsReducer'
import searchResultReducer from './searchResultReducer';
import initialState from './initialState'

const reducers = combineReducers({
  query: modelReducer('query', initialState.query),
  queryForm: formReducer('query', initialState.query),
  suggestions: searchTermSuggestionsReducer,
  result: searchResultReducer
});

export default reducers;
