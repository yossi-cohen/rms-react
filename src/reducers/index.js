import { combineReducers } from 'redux'
import { formReducer, } from 'react-redux-form';

import searchReducer from './searchReducer';
import videoPlayerReducer from './videoPlayerReducer';

const reducers = combineReducers({
  search: searchReducer.reducer,
  searchForm: formReducer('search', searchReducer.initialState),
  player: videoPlayerReducer
});

export default reducers;
