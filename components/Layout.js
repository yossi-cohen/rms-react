import React from 'react';

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import AppBar from './appbar/AppBar';
import Video from './Video';

export default class Layout extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                <div>
                    <AppBar />
                    <Video />
                </div>
            </MuiThemeProvider>
        );
    }
}
