import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import { applyMiddleware, createStore, combineReducers } from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import promise from "redux-promise-middleware";

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import App from './components/App';
import Search from './components/Search';
import Settings from './components/Settings';
import Video from './components/Video';

// reducers
import reducers from './reducers';

//lilox:log
// const middleware = {};
const middleware = applyMiddleware(promise(), thunk, logger())
const store = createStore(reducers, middleware);

// ---------------------------------------------------------------
// TESTS - start
// ---------------------------------------------------------------
// store.subscribe(() => {
//     console.log('store changed: ', store.getState())
// });

store.dispatch({type: "CHANGE_NAME", payload: 'lilo'});
store.dispatch({type: "CHANGE_AGE", payload: 50});

// update video-list
store.dispatch({type: "UPDATE_VIDEOS", payload: [
        {textKey: 'Material UI', valueKey: 'video-1'},
        {textKey: 'Elemental UI', valueKey: 'video-2'},
        {textKey: 'GrommaddTodoet', valueKey: 'video-3'},
        {textKey: 'Mui', valueKey: 'video-4'},
        {textKey: 'Rebass', valueKey: 'video-5'}
    ]
});

// add video
store.dispatch({type: "ADD_VIDEO", payload: {textKey: 'New Video', valueKey: 'video-6'}});

// store.dispatch((dispatch) => {
//     dispatch({type: 'FOO'})
//     // do somthing async
//     dispatch({type: 'BAR'})
// });

// ---------------------------------------------------------------
// TESTS - end
// ---------------------------------------------------------------

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Search} />
            <Route path="/search" component={Search} />
            <Route path="/video" component={Video} />
            <Route path="/settings" component={Settings} />
        </Route>
    </Router>, 
    document.getElementById('app')
);
