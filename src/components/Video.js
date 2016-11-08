import React from 'react';

export default class Video extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{
                width: '400px',
                height: '400px',
                margin: '0 auto',
                border: '2px solid #FF9800',
                align: 'center', 
                textAlign: 'center',
            }}>
                <h1>Video</h1>
            </div>
        );
    }
}
