import { combineReducers } from 'redux'
import catalogReducer from './catalog/catalogReducer';
import searchReducers from './search'
import videoPlayerReducer from './video/videoPlayerReducer';

const reducers = combineReducers({
  catalog: catalogReducer,
  search: searchReducers,
  player: videoPlayerReducer
});

export default reducers;
