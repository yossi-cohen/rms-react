import React from 'react';
import Title from './Title';

export default class Header extends React.Component {
    updateTitle(e) {
        this.props.setTitle(e.target.value);
    }

    render() {
        return (
            <div>
                <Title title={this.props.title} />
                <input value={this.props.title} onChange={this.updateTitle.bind(this)} />
            </div>
        );
    }
}