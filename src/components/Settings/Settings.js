import React from 'react';

import Toggle from 'material-ui/Toggle';

export default class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = { locked: false }
    }


    render() {
        return (
            <div className="settings">
                <h1>Settings</h1>
                <Toggle
                    label='Locked'
                    defaultToggled={this.state.locked}
                    onToggle={this.handleChangeLocked.bind(this)}
                    labelPosition='right'
                    style={{ margin: 20, textAlign: 'left' }}
                    />
            </div>
        );
    }

    handleChangeLocked(event, locked) {
        this.setState({ locked: locked });
    };
}
