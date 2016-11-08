import React from 'react';

import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import Toggle from 'material-ui/Toggle';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

export default class RightMenu extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <IconMenu
                iconButtonElement={
                    <IconButton><MoreVertIcon /></IconButton>
                }
                targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                >
                <MenuItem primaryText="Sign out" onTouchTap={this.handleSignOut.bind(this)} />
                <MenuItem primaryText="Settings..." onTouchTap={this.handleSettings.bind(this)} />
            </IconMenu>
        );
    }

    handleSignOut() {
        console.log('AppBarTop - handleSignOut');
    }

    handleSettings() {
        console.log('AppBarTop - handleSettings');
    }
}

RightMenu.muiName = 'IconMenu';
