import React from 'react';
import { IconButton, IconMenu, ListItem, MenuItem } from 'material-ui';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { grey400, darkBlack, lightBlack } from 'material-ui/styles/colors';

import VideoImage from 'material-ui/svg-icons/av/videocam';

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
    <MenuItem>Play</MenuItem>
    <MenuItem>Properties</MenuItem>
  </IconMenu>
);

export default class VideoListItem extends React.Component {
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
        onTouchTap={(event) => this.showVideo(event, video)}
        />
    );
  }

  showVideo(event, video) {
    console.log('lilox ------------------------------ showVideo: ', video);
  }
}
