import React from 'react';
import _ from 'lodash';

import CesiumComponent from 'components/Cesium/CesiumComponent';
import VideoPlayer from 'components/Video/VideoPlayer';
import ResizableAndMovable from 'react-resizable-and-movable';

import Blink from 'components/Util/Blink';
import RecordIcon from 'material-ui/svg-icons/content/add-circle';
import {
    Subheader,
} from 'material-ui';

export default class Home extends React.Component {
    constructor() {
        super();
    }

    //lilox: <CesiumComponent />
    // <Blink><RecordIcon color='red' /></Blink>
    render() {
        return (
            <div>
                <ResizableAndMovable>
                    <Subheader style={{ display: 'flex', alignItems: 'center' }}>
                        <span>Recording&nbsp;</span>
                        <Blink>
                            <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 10" />
                                <circle cx="5" cy="5" r="5" fill="red" />
                            </svg>
                        </Blink>
                    </Subheader>
                    <VideoPlayer poster='images/video-poster.png' />
                </ResizableAndMovable>
            </div>
        );
    }
}
