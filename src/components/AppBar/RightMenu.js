import React from 'react';

import { Link } from 'react-router';

import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import Toggle from 'material-ui/Toggle';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

export default class RightMenu extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <IconMenu
                iconButtonElement={
                    <IconButton><MoreVertIcon color='white' /></IconButton>
                }
                targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            >
                <MenuItem containerElement={<Link to="/home" />} primaryText="Home..." />
                <MenuItem containerElement={<Link to="/search" />} primaryText="Search..." />
                <MenuItem containerElement={<Link to="/settings" />} primaryText="Settings..." />
            </IconMenu>
        );
    }

    handleSignOut() {
        console.log('AppBarTop - handleSignOut');
    }
}

RightMenu.muiName = 'IconMenu';
