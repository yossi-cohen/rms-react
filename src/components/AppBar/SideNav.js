import React from 'react';
import Drawer from 'material-ui/Drawer';
import Catalog from 'components/Catalog/Catalog';

export default class SideNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = { open: this.props ? this.props.open : false }
    }

    render() {
        return (
            <Drawer
                docked={false}
                width={250}
                open={this.state.open}
                onRequestChange={(open) => this.setState({ open })}
                >
                <Catalog />
            </Drawer>
        );
    }

    handleClose() {
        this.setState({open: false});
    }
}
