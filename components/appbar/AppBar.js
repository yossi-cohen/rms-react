import React from 'react';

import MuiAppBar from 'material-ui/AppBar';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import SearchIcon from 'material-ui/svg-icons/action/search';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';

import RightMenu from './RightMenu';
import ResultNav from './ResultNav';

const styles = {
    container: {
        textAlign: 'center',
        paddingTop: 200,
    },
};

export default class AppBar extends React.Component {
    constructor() {
        super();
        this.state = { searchDialogOpen: false, locked: true }
    }

    render() {
        const standardActions = (
            <FlatButton
                label="Ok"
                primary={true}
                onTouchTap={this.handleCloseSearch.bind(this)}
                />
        );

        return (
            <div>
                <Toggle
                    label="Lock"
                    defaultToggled={true}
                    onToggle={this.handleChange.bind(this)}
                    labelPosition="right"
                    style={{ margin: 20 }}
                    />

                <MuiAppBar
                    style={{ color: 'white', background: 'gray' }}
                    title="הקלטות"
                    iconElementRight={
                        <div>
                            <IconButton tooltip="search" onTouchTap={this.handleOpenSearch.bind(this)}>
                                <SearchIcon />
                            </IconButton>
                            <RightMenu />
                        </div>
                    }

                    onLeftIconButtonTouchTap={this.handleLeftIconTap.bind(this)}
                    />

                <ResultNav ref="resultNav" open={false} />
                <div style={styles.container}>
                    <Dialog
                        ref="dialog"
                        title="Search"
                        open={this.state.searchDialogOpen}
                        actions={standardActions}
                        onRequestClose={this.handleCloseSearch.bind(this)}
                        >
                        lilox:TODO
                    </Dialog>
                </div>
            </div>
        );
    }

    handleLeftIconTap() {
        this.refs.resultNav.setState({ open: !this.refs.resultNav.state.open });
    }

    handleOpenSearch() {
        this.setState({ searchDialogOpen: true });
    };

    handleCloseSearch() {
        this.setState({ searchDialogOpen: false });
    };

    handleChange(event, locked) {
        this.setState({ locked: locked });
    };
}
