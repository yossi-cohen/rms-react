import React from 'react';

import MuiAppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import SearchIcon from 'material-ui/svg-icons/action/search';

import RightMenu from './RightMenu';
import ResultNav from './ResultNav';
import SearchDialog from './SearchDialog';

export default class AppBar extends React.Component {
    constructor() {
        super();
        this.state = { searchDialogOpen: false, resultNavOpen: false }
    }

    render() {

        return (
            <div>
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

                    onLeftIconButtonTouchTap={this.handleToggleResultNav.bind(this)}
                >
                </MuiAppBar>
                <SearchDialog ref="search" open={this.state.searchDialogOpen} />
                <ResultNav ref="resultNav" open={this.state.resultNavOpen} />
            </div>
        );
    }

    handleOpenSearch() {
        this.refs.search.setState({ open: !this.state.searchDialogOpen });
    };

    handleToggleResultNav() {
        this.refs.resultNav.setState({ open: !this.refs.resultNav.state.open });
    }
}
