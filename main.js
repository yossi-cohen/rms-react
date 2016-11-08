import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import injectTapEventPlugin from 'react-tap-event-plugin';

import Layout from './components/Layout';
import Search from './components/Search';
import Settings from './components/Settings';
import Video from './components/Video';

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