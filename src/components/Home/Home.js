import React from 'react';
import _ from 'lodash';

import CesiumComponent from 'components/Cesium/CesiumComponent';
import VideoPlayer from 'components/Video/VideoPlayer';
import ResizableAndMovable from 'react-resizable-and-movable';

export default class Home extends React.Component {
    constructor() {
        super();
    }

    //lilox: <CesiumComponent />
    render() {
        return (
            <div>
                <CesiumComponent />
                <ResizableAndMovable>
                    <VideoPlayer poster='images/video-poster.png' />
                </ResizableAndMovable>
            </div>
        );
    }
}
