import React from 'react';
import { connect } from "react-redux";
import { IconButton, IconMenu, ListItem, MenuItem } from 'material-ui';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { grey400, darkBlack, lightBlack } from 'material-ui/styles/colors';

import VideoImage from 'material-ui/svg-icons/av/videocam';

import { playVideo } from '../../actions/playVideo';

const iconButtonElement = (
  <IconButton
    touch={true}
    tooltip="more"
    tooltipPosition="bottom-left"
    >
    <MoreVertIcon color={grey400} />
  </IconButton>
);

//lilox:TODO 
const rightIconMenu = (
  <IconMenu iconButtonElement={iconButtonElement}>
    <MenuItem onTouchTap={() => this.showVideo(this.props.video)}>Play</MenuItem>
    <MenuItem onTouchTap={() => this.handleProperties()}>Properties</MenuItem>
  </IconMenu>
);

class SearchResultItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { video } = this.props;
    return (
      <ListItem
        primaryText={video.title}
        secondaryText={video.vid}
        leftIcon={<VideoImage />}
        rightIconButton={rightIconMenu}
        onTouchTap={() => this.showVideo(video)}
        />
    );
  }

  showVideo(video) {
    this.props.dispatch(playVideo(video));
  }

  handleProperties(video) {
    console.log('lilox: TODO');
  }
}

export default connect()(SearchResultItem);
