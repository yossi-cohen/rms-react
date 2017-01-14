import React from 'react';
import { connect } from "react-redux";

import { fetchCatalog } from 'actions/catalogActions';
import { playVideo } from 'actions/videoActions';

import PlayIcon from 'material-ui/svg-icons/av/play-arrow';
import VideoCam from 'material-ui/svg-icons/av/videocam';
import VideoCamOff from 'material-ui/svg-icons/av/videocam-off';

import Blink from 'components/Util/Blink';
import {
    IconButton,
    List,
    ListItem,
    Toggle,
} from 'material-ui';

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
            <List>
                {this.state.videos.map(v => this.renderItem(v))}
            </List>
        );
    }

    renderItem(video) {
        return (
            <ListItem
                primaryText={video.title}
                secondaryText={this.isPlaying(video) ? 'playing' : 'stopped'}
                leftIcon={this.renderLeftIcon(video)}
                rightIconButton={this.renderPlayStopIcon(video)}
                primaryTogglesNestedList={true}
                initiallyOpen={false}
                nestedItems={[
                    <ListItem
                        primaryText={video.title}
                        leftIcon={this.renderLeftIcon(video)}
                        rightIconButton={this.renderPlayStopIcon(video)}
                        />,
                ]}

                />
        );
    }

    // <Blink><PlayIcon color='red' /></Blink>
    renderLeftIcon(video) {
        return (
            <VideoCam />
        );
    }

    isPlaying(video) {
        return video.state && video.state.playing;
    }

    renderPlayStopIcon(video) {
        return (
            <IconButton onTouchTap={() => this.handlePlayStop(video)}>
                <PlayIcon color='green' />
            </IconButton>
        );
    }

    handlePlayStop(video) {
        this.props.dispatch(playVideo(video));
    }
}

export default connect((store) => ({
    videos: store.catalog.videos,
}))(Catalog);
