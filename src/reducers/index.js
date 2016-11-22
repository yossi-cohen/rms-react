import { combineReducers } from 'redux'
import { modelReducer, formReducer, } from 'react-redux-form';

import searchReducer from './searchReducer';
import videoPlayerReducer from './videoPlayerReducer';

const initialSearch = {
    text: '',
    startDate: null,
    startTime: null,
    endDate: null,
    endTime: null
};

const reducers = combineReducers({
  search: modelReducer('search', initialSearch),
  searchForm: formReducer('search', initialSearch),
  mySearch: searchReducer,
  player: videoPlayerReducer
});

export default reducers;
