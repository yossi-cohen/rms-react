import React from 'react';
import { List } from 'material-ui';
import VideoItem from './VideoItem';

export default class SearchResult extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const videoItems = this.props.videos.map((video) => {
            return <VideoItem key={video.vid} video={video} />
        });

        return (
            <List>
                {videoItems}
            </List>
        );
    }
}
