import React from 'react';
import Catalog from 'components/Catalog/Catalog';
import Search from 'components/Search/Search';
import SearchIcon from 'material-ui/svg-icons/action/search';
import OnlineIcon from 'material-ui/svg-icons/av/videocam';
import {
    Drawer,
    Tabs,
    Tab
} from 'material-ui';

const styles = {
    tabItem: {
        background: 'indigo',
    }
}

export default class SideNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: this.props ? this.props.open : false,
            searchActivated: false,
        }
    }

    render() {
        return (
            <Drawer
                docked={false}
                width={300}
                open={this.state.open}
                onRequestChange={(open) => this.setState({ open })}
                >
                <Tabs tabItemContainerStyle={styles.tabItem}>
                    <Tab label='Online' icon={<OnlineIcon />} onActive={() => this.onlineActive()}>
                        <Catalog />
                    </Tab>
                    <Tab label='Search' icon={<SearchIcon />} onActive={() => this.searchActive()}>
                        <Search active={this.state.searchActivated} />
                    </Tab>
                </Tabs>
            </Drawer>
        );
    }

    handleClose() {
        this.setState({ open: false });
    }

    onlineActive() {
        this.setState({ searchActivated: false })
    }

    searchActive() {
        this.setState({ searchActivated: true })
    }
}
