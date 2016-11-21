import { combineReducers } from 'redux'
import { modelReducer, formReducer, } from 'react-redux-form';

import userReducer from './userReducer';
import fetchVideosReducer from './fetchVideosReducer';
import searchResultReducer from './searchResultReducer';
import playVideoReducer from './playVideoReducer';

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
  user: userReducer,
  videos: fetchVideosReducer,
  searchResult: searchResultReducer,
  player: playVideoReducer
});

export default reducers;
