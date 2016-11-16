import { combineReducers } from 'redux'
import { modelReducer, formReducer, } from 'react-redux-form';

import userReducer from './userReducer';
import videosReducer from './videosReducer';

const initialSearch = {
    text: '',
    fromDate: '',
    fromTime: '',
    toDate: '',
    toTime: ''
}

const reducers = combineReducers({
  search: modelReducer('search', initialSearch),
  searchForm: formReducer('search', initialSearch),
  user: userReducer,
  videos: videosReducer
})

export default reducers
