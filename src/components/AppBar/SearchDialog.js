import React from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import Search from '../Search/Search';

const styles = {
    container: {
        textAlign: 'center',
        paddingTop: 200,
    },
};

export default class SearchDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = { open: this.props ? this.props.open : false }
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
            <div style={styles.container}>
                <Dialog
                        ref="dialog"
                        open={this.state.open}
                        actions={standardActions}
                        onRequestClose={this.handleCloseSearch.bind(this)}
                        >
                        <Search />
                </Dialog>
            </div>
        );
    }

    handleCloseSearch() {
        this.setState({ open: false });
    };
}
