import { combineReducers } from 'redux'
import searchReducers from './search'

const reducers = combineReducers({
  search: searchReducers
});

export default reducers;
