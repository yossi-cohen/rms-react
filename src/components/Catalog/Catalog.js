import React from 'react';
import { connect } from "react-redux";
import { List, ListItem, IconButton } from 'material-ui';

import { fetchCatalog } from 'actions/catalogActions';
import { playVideo } from 'actions/videoActions';

import PlayIcon from 'material-ui/svg-icons/av/play-arrow';

class Catalog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            videos: []
        }
    }

    componentWillMount() {
        this.props.dispatch(fetchCatalog());
    }

    componentWillReceiveProps(props) {
        this.setState({ videos: props.videos });
    }

    render() {
        return (
            <div>
                <List>
                    {this.state.videos.map(v => this.renderItem(v))}
                </List>
            </div>
        );
    }

    renderPlayStopIcon(video) {
        return (
            <IconButton onTouchTap={() => this.handlePlayStop(video)}>
                <PlayIcon color='green' />
            </IconButton>
        );
    }

    renderItem(video) {
        return (
            <ListItem primaryText={video.title} secondaryText={this.isPlaying(video) ? 'playing' : 'stopped'} rightIconButton={this.renderPlayStopIcon(video)} />
        );
    }

    isPlaying(video) {
        return video.state && video.state.playing;
    }

    handlePlayStop(video) {
        console.log('lilox: ------------------------------------> play/stop:', video.title);
        this.props.dispatch(playVideo(video));
    }
}

export default connect((store) => ({
    videos: store.catalog.videos,
}))(Catalog);
