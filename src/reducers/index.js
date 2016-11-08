import { combineReducers } from 'redux'

import userReducer from './userReducer';
import videosReducer from './videosReducer';

const reducers = combineReducers({
  user: userReducer,
  videos: videosReducer
})

export default reducers

