import React from 'react';

export default class Search extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{
                width: '80%',
                height: '300px',
                margin: '0 auto',
                border: '2px solid #FF9800',
                align: 'center', 
                textAlign: 'center',
            }}>
                <h1>Search</h1>
            </div>
        );
    }
}
