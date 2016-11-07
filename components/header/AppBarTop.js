import React from 'react';

import mui from 'material-ui';
import AppBar from 'material-ui/AppBar';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import SearchIcon from 'material-ui/svg-icons/action/search';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

const styles = {
    container: {
        textAlign: 'center',
        paddingTop: 200,
    },
};

export default class AppBarTop extends React.Component {
    constructor() {
        super();
        this.state = { open: false }

        this.handleLeftIconTap = this.handleLeftIconTap.bind(this)
        this.handleOpenSearch = this.handleOpenSearch.bind(this)
        this.handleCloseSearch = this.handleCloseSearch.bind(this)
    }

    // use darkBaseTheme
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
                <AppBar
                    title="AppBar Title"
                    iconElementRight={
                        <IconButton tooltip="search" onTouchTap={this.handleOpenSearch}>
                            <SearchIcon />
                        </IconButton>
                    }
                    onLeftIconButtonTouchTap={this.handleLeftIconTap}
                    />

                <div style={styles.container}>
                    <Dialog
                        ref="dialog"
                        title="Super Secret Password"
                        open={this.state.open}
                        actions={standardActions}
                        onRequestClose={this.handleCloseSearch}
                        >
                        1-2-3-4-5handleClose
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
}
