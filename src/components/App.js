import React from 'react';

import { Link } from 'react-router';

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import AppBar from './appbar/AppBar';
import Search from './Search';
import Video from './Video';

//lilox:TODO - fetch autocomplete data from server...
// import { connect } from 'react-redux'
// import { fetchVideos } from '../actions';

//lilox
// function mapStateToProps(state) {
//     const { data } = state;
//     return {
//         data
//     };
// }

//lilox
// function mapDispatchToProps(dispatch) {
//     return {
//         fetchVideos() {
//             dispatch(fetchVideos());
//         }
//     }
// }

export default class App extends React.Component {
    constructor() {
        super();
    }

    //lilox:TODO
    // componentWillMount() {
    //     console.log('lilox: App --------------------------------------------------');
    //     this.props.fetchVideos();
    // }

    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                <div>
                    <AppBar />
                    {this.props.children}
                </div>
            </MuiThemeProvider>
        );
    }
}

//lilox
// Export a container that wraps App
// export default connect(mapStateToProps, mapDispatchToProps)(App);
