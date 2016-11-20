import React from 'react';

//lilox:import AppBar from '../AppBar/AppBar';

export default class App extends React.Component {
    constructor() {
        super();
    }

                //lilox: <AppBar />
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}
