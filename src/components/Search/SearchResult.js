import React from 'react';
import { connect } from "react-redux";
import { IconButton, IconMenu, List, ListItem, MenuItem } from 'material-ui';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { grey400, darkBlack, lightBlack } from 'material-ui/styles/colors';
import VideoImage from 'material-ui/svg-icons/av/videocam';
import { playVideo } from '../../actions/playVideo';

class SearchResult extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const videoItems = this.props.videos.map((video) => { return this.renderResultItem(video) });

        return (
            <List>
                {videoItems}
            </List>
        );
    }

    renderResultItem(video) {
        return (
            <ListItem
                key={video.vid}
                primaryText={video.title}
                secondaryText={video.vid}
                leftIcon={<VideoImage />}
                rightIconButton={this.renderRightIconMenu(video)}
                onTouchTap={() => this.playVideo(video)}
                />
        );
    }

    renderRightIconMenu(video) {
        const iconButtonElement = (
            <IconButton
                touch={true}
                tooltip="more"
                tooltipPosition="bottom-left"
                >
                <MoreVertIcon color={grey400} />
            </IconButton>
        );

        return (
            <IconMenu iconButtonElement={iconButtonElement}>
                <MenuItem onTouchTap={() => this.playVideo(video)}>Play</MenuItem>
                <MenuItem onTouchTap={() => this.handleProperties()}>Properties</MenuItem>
            </IconMenu>
        );
    }

    playVideo(video) {
        this.props.dispatch(playVideo(video));
    }

    handleProperties(video) {
        console.log('lilox: TODO - handleProperties');
    }
}

export default connect()(SearchResult);
