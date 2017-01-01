import React from 'react';
import { connect } from "react-redux";
import { List, ListItem } from 'material-ui';
import VideoImage from 'material-ui/svg-icons/av/videocam';
import { playVideo } from 'actions/videoActions';

class SearchResult extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const items = this.props.result.videos.map((v) => { return this.renderVideoItem(v) });

        return (
            <List>
                {items}
            </List>
        );
    }

    renderVideoItem(video) {
        return (
            <ListItem
                key={video.vid}
                primaryText={video.title}
                secondaryText={video.vid}
                leftIcon={<VideoImage />}
                onTouchTap={() => this.playVideo(video)}
                />
        );
    }

    playVideo(video) {
        this.props.dispatch(playVideo(video));
    }
}

export default connect()(SearchResult);
