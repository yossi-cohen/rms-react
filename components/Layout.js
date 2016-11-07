import React from 'react';

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import Footer from './footer/Footer';
import Header from './header/Header';

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
                    <Header setTitle={this.setTitle.bind(this)} title={this.state.title} />
                    <Footer />
                </div>
            </MuiThemeProvider>
        );
    }
}
