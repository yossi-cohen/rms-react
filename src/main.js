import "../public/css/main.css"

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'

import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import store from "./store";

import App from './components/App/App';
import Search from './components/Search/Search';
import Settings from './components/Settings/Settings';
import Video from './components/Video/Video';

ReactDOM.render(
    <MuiThemeProvider>
        <Provider store={store}>
            <Router history={hashHistory}>
                <Route path="/" component={App}>
                    <IndexRoute component={Search} />
                    <Route path="/search" component={Search} />
                    <Route path="/video" component={Video} />
                    <Route path="/settings" component={Settings} />
                </Route>
            </Router>
        </Provider>
    </MuiThemeProvider>,
    document.getElementById('app')
);
