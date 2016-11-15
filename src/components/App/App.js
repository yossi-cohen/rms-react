import React from 'react';

import AppBar from '../AppBar/AppBar';

export default class App extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <AppBar />
                {this.props.children}
            </div>
        );
    }
}
