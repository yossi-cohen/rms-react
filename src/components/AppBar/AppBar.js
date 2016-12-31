import React from 'react';

import MuiAppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import SearchIcon from 'material-ui/svg-icons/action/search';

import { Link } from 'react-router';

import RightMenu from './RightMenu';
import SideNav from './SideNav';

export default class AppBar extends React.Component {
    constructor() {
        super();
        this.state = { sideNavOpen: false }
    }

    render() {

        return (
            <div>
                <MuiAppBar
                    style={{ color: 'white', background: 'indigo' }}
                    iconElementRight={
                        <div>
                            <IconButton tooltip='search videos' onTouchTap={this.handleOpenSearch.bind(this)}>
                                <SearchIcon color='white' />
                            </IconButton>
                            <RightMenu  />
                        </div>
                    }

                    onLeftIconButtonTouchTap={this.handleToggleSideNav.bind(this)}
                    >
                </MuiAppBar>
                <SideNav ref="sideNav" open={this.state.sideNavOpen} />
            </div>
        );
    }

    handleOpenSearch() {
        //lilox:TODO
        window.location.assign("/#/Search");
    };

    handleToggleSideNav() {
        this.refs.sideNav.setState({ open: !this.refs.sideNav.state.open });
    }
}
