import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

export default class ResultNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = { open: this.props ? this.props.open : false }
        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        return (
            <Drawer
                docked={false}
                width={250}
                open={this.state.open}
                onRequestChange={(open) => this.setState({ open })}
                >
                <MenuItem onTouchTap={this.handleClose}>Item 1</MenuItem>
                <MenuItem onTouchTap={this.handleClose}>Item 2</MenuItem>
            </Drawer>
        );
    }

    handleClose() {
        this.setState({open: false});
    }
}
