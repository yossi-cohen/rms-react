import React from 'react';

import AppBarTop from './AppBarTop';
import Title from './Title';

import RaisedButton from 'material-ui/RaisedButton';

export default class Header extends React.Component {
    updateTitle(e) {
        this.props.setTitle(e.target.value);
    }

    render() {
        return (
            <div>
                <AppBarTop />

                <Title title={this.props.title} />
                
                <input value={this.props.title} onChange={this.updateTitle.bind(this)} />
                <br />
                <RaisedButton label="Default" />
            </div>
        );
    }
}