import React from 'react';

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import AppBar from './appbar/AppBar';

export default class Layout extends React.Component {
    constructor() {
        super();
        this.state = { title: 'Welcome' }
    }

    setTitle(title) {
        this.setState({ title });
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                <div>
                    <AppBar />
                </div>
            </MuiThemeProvider>
        );
    }
}
