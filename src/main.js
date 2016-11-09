import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import store from "./store";
import { changeName, changeAge } from "./actions/userActions";
import { fetchVideos } from "./actions/videoActions";

import App from './components/App';
import Search from './components/Search';
import Settings from './components/Settings';
import Video from './components/Video';

//lilox
test(store);

ReactDOM.render(
    <Provider store={store}>
        <Router history={hashHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={Search} />
                <Route path="/search" component={Search} />
                <Route path="/video" component={Video} />
                <Route path="/settings" component={Settings} />
            </Route>
        </Router> 
    </Provider>,
    document.getElementById('app')
);

function test(store) {
    store.subscribe(() => {
        console.log('store changed: ', store.getState())
    });

    store.dispatch(changeName('lilo'));
    store.dispatch(changeAge(50));

    store.dispatch(fetchVideos());

    // update video-list
    // store.dispatch({type: "UPDATE_VIDEOS", payload: [
    //         {textKey: 'Material UI', valueKey: 'video-1'},
    //         {textKey: 'Elemental UI', valueKey: 'video-2'},
    //         {textKey: 'GrommaddTodoet', valueKey: 'video-3'},
    //         {textKey: 'Mui', valueKey: 'video-4'},
    //         {textKey: 'Rebass', valueKey: 'video-5'}
    //     ]
    // });

    // add video
    // store.dispatch({type: "ADD_VIDEO", payload: {textKey: 'New Video', valueKey: 'video-6'}});
}
