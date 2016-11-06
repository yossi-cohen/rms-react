import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import Layout from './components/Layout';
import App from './components/App';

// require('./style.css');

ReactDOM.render(
    // <App txt="Hello World"/>,
    // <Layout />,
    <Router history={hashHistory}>
        <Route path="/" component={Layout} />
    </Router>, 
    document.getElementById('app')
);