import React from 'react';
import Footer from './footer/Footer';
import Header from './header/Header';

export default class Layout extends React.Component {
    constructor() {
        super();
        this.state = { title: 'Welcom' }
    }

    setTitle(title) {
        this.setState({ title });
    }

    render() {
        return (
            <div>
                <Header setTitle={this.setTitle.bind(this)} title={this.state.title} />
                <Footer />
            </div>
        );
    }
}