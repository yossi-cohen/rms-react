import React from 'react';
import _ from 'lodash';

import CesiumComponent from 'components/Cesium/CesiumComponent';

import VideoPlayer from 'components/Video/VideoPlayer';
import ResizableAndMovable from 'react-resizable-and-movable';

var state= {
    foo: {
        bar: false
    }
}

export default class Home extends React.Component {
    constructor() {
        super();
    }

    //<CesiumComponent />
    render() {
    // let new_state = {... state, baz: false}
    // var new_state = Object.assign({}, state);
    var new_state = _.cloneDeep(state);
    new_state.foo.bar = true;
    console.log('======================================= state.foo.bar:', state.foo.bar);
    console.log('======================================= new_state.foo.bar:', new_state.foo.bar);
    

        return (
            <div>
                <ResizableAndMovable>
                    <VideoPlayer poster='images/video-poster.png' />
                </ResizableAndMovable>
            </div>
        );
    }
}
