import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import { createStore, combineReducers } from 'redux'

import injectTapEventPlugin from 'react-tap-event-plugin';

import Layout from './components/Layout';
import Search from './components/Search';
import Settings from './components/Settings';
import Video from './components/Video';

// lilox
// import userReducer from './store/userReducer';
// import videosReducer from './store/videosReducer';
const userReducer = (state = {}, action) => {
    switch (action.type) {
        case 'CHANGE_NAME':
            state = {...state, name: action.payload}
            break;
        case 'CHANGE_AGE':
            state = {...state, age: action.payload}
            break;
    }

    return state;
};

const videosReducer = (state = [], action) => {
    switch (action.type) {
        case 'CHANGE_VIDEOS':
            state = {...state, videos: action.payload}
            break;

        case 'ADD_VIDEO':
            return state.videos.concat(action.payload);
            break;
    }

    return state;
};

const reducers = combineReducers({
    user: userReducer,
    videos: videosReducer
});

const store = createStore(reducers);

store.subscribe(() => {
    console.log('store changed: ', store.getState())
});

store.dispatch({type: "CHANGE_NAME", payload: 'lilo'});
store.dispatch({type: "CHANGE_AGE", payload: 50});

store.dispatch({type: "CHANGE_VIDEOS", payload: [
        {textKey: 'Material UI', valueKey: 'video-1'},
        {textKey: 'Elemental UI', valueKey: 'video-2'},
        {textKey: 'Grommet', valueKey: 'video-3'},
        {textKey: 'Mui', valueKey: 'video-4'},
        {textKey: 'Rebass', valueKey: 'video-5'},
    ]
});

// add video
store.dispatch({type: "ADD_VIDEO", payload: {textKey: 'New Video', valueKey: 'video-6'}});

//lilox:TODO - remove video
// store.dispatch({type: "REMOVE_VIDEO", payload: {valueKey: 'video-6'}});

// Needed for onTouchTap 
// http://stackoverfloinjectTapEventPluginw.com/a/34015469/988941 
injectTapEventPlugin();

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={Layout}>
            <IndexRoute component={Search} />
            <Route path="/search" component={Search} />
            <Route path="/video" component={Video} />
            <Route path="/settings" component={Settings} />
        </Route>
    </Router>, 
    document.getElementById('app')
);
