import React from 'react';

import AppBarTop from './AppBarTop';
import Title from './Title';

import RaisedButton from 'material-ui/RaisedButton';

export default class Header extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.handleDefaultButtonTap = this.handleDefaultButtonTap.bind(this);
    }
    
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
                <RaisedButton label="Click Me!" onTouchTap={this.handleDefaultButtonTap} />
            </div>
        );
    }

    handleDefaultButtonTap() {
        //lilo:TODO
        console.log('AppBarTop - handleButtonTap');
    }
}
