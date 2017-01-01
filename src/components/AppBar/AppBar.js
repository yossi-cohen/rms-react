import React from 'react';
import MuiAppBar from 'material-ui/AppBar';
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
                    onLeftIconButtonTouchTap={this.handleToggleSideNav.bind(this)}
                    >
                </MuiAppBar>
                <SideNav ref="sideNav" open={this.state.sideNavOpen} />
            </div>
        );
    }

    handleToggleSideNav() {
        this.refs.sideNav.setState({ open: !this.refs.sideNav.state.open });
    }
}
