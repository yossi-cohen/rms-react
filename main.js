import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import injectTapEventPlugin from 'react-tap-event-plugin';

import Layout from './components/Layout';

// Needed for onTouchTap 
// http://stackoverfloinjectTapEventPluginw.com/a/34015469/988941 
injectTapEventPlugin();

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={Layout} />
    </Router>, 
    document.getElementById('app')
);