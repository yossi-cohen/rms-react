import { combineReducers } from 'redux'
import searchReducers from './search'
import catalogReducer from './catalog';

const reducers = combineReducers({
  search: searchReducers,
  catalog: catalogReducer
});

export default reducers;
