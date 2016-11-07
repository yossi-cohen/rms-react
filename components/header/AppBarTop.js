import React from 'react';

import AppBar from 'material-ui/AppBar';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import SearchIcon from 'material-ui/svg-icons/action/search';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';

import RightMenu from './RightMenu';

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
            <div>הקלטות
                <Toggle
                    label="Lock"
                    defaultToggled={true}
                    onToggle={this.handleChange}
                    labelPosition="right"
                    style={{ margin: 20 }}
                    />

                <AppBar
                    title="הקלטות"
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
        console.log('AppBarTop - handleLeftIconTap');
    }

    handleOpenSearch() {
        console.log('AppBarTop - handleOpenSearch');
        this.setState({ open: true });
    };

    handleCloseSearch() {
        console.log('AppBarTop - handleCloseSearch');
        this.setState({ open: false });
    };

    handleChange(event, locked) {
        this.setState({ locked: locked });
    };
}
