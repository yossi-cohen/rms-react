import { combineReducers } from 'redux'
import { modelReducer, formReducer } from 'react-redux-form';
import searchResultReducer from './searchResultReducer';
import initialState from './initialState'

const reducers = combineReducers({
  query: modelReducer('query', initialState.query),
  queryForm: formReducer('query', initialState.query),
  result: searchResultReducer
});

export default reducers;
