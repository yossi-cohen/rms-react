import React from 'react';

import mui from 'material-ui';
import AppBar from 'material-ui/AppBar';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import SearchIcon from 'material-ui/svg-icons/action/search';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

// lilox
import IconMenu from 'material-ui/IconMenu';
import Toggle from 'material-ui/Toggle';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

class RightMenu extends React.Component {
    constructor() {
        super();

        this.handleSignOut = this.handleSignOut.bind(this);
        this.handleSettings = this.handleSettings.bind(this);
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
                <MenuItem primaryText="Sign out" onTouchTap={this.handleSignOut} />
                <MenuItem primaryText="Settings..." onTouchTap={this.handleSettings} />
            </IconMenu>
        );
    }

    handleSignOut() {
        console.log('AppBar - handleSignOut');
    }

    handleSettings() {
        console.log('AppBar - handleSettings');
    }
}

RightMenu.muiName = 'IconMenu';

const styles = {
    container: {
        textAlign: 'center',
        paddingTop: 200,
    },
};

export default class AppBarTop extends React.Component {
    constructor() {
        super();
        this.state = { open: false, locked: true }

        this.handleLeftIconTap = this.handleLeftIconTap.bind(this);
        this.handleOpenSearch = this.handleOpenSearch.bind(this);
        this.handleCloseSearch = this.handleCloseSearch.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const standardActions = (
            <FlatButton
                label="Ok"
                primary={true}
                onTouchTap={this.handleCloseSearch}
                />
        );

        return (
            <div>
                <Toggle
                    label="Lock"
                    defaultToggled={true}
                    onToggle={this.handleChange}
                    labelPosition="right"
                    style={{ margin: 20 }}
                    />

                <AppBar
                    title="AppBar Title"
                    iconElementRight={
                        <div>
                            <IconButton tooltip="search" onTouchTap={this.handleOpenSearch}>
                                <SearchIcon />
                            </IconButton>
                            <RightMenu />
                        </div>
                    }

                    onLeftIconButtonTouchTap={this.handleLeftIconTap}
                    />

                <div style={styles.container}>
                    <Dialog
                        ref="dialog"
                        title="Search"
                        open={this.state.open}
                        actions={standardActions}
                        onRequestClose={this.handleCloseSearch}
                        >
                        lilox:TODO
                    </Dialog>
                </div>
            </div>
        );
    }

    handleLeftIconTap() {
        //lilo:TODO
        console.log('AppBar - handleLeftIconTap');
    }

    handleOpenSearch() {
        console.log('AppBar - handleOpenSearch');
        this.setState({ open: true });
    };

    handleCloseSearch() {
        console.log('AppBar - handleCloseSearch');
        this.setState({ open: false });
    };

    handleChange(event, locked) {
        this.setState({ locked: locked });
    };
}
