import "styles/main.css"

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

if (module.hot) {
    module.hot.accept();
}

ReactDOM.render(
    <MuiThemeProvider>
        <Provider store={store}>
            <Router history={hashHistory}>
                <Route path="/" component={App}>
                    <IndexRoute component={Search} />
                    <Route path="/search" component={Search} />
                    <Route path="/settings" component={Settings} />
                </Route>
            </Router>
        </Provider>
    </MuiThemeProvider>,
    document.getElementById('app')
);
