import React from 'react';

// stateless component: const App = () => <h1>Hello World</h1>

// class can have state
class App extends React.Component {
    constructor() {
        super();
        this.name = "me:";
    }
    render() {
        return (
            <div>
                <h1>{this.name}</h1>
                <h1>{this.props.txt}</h1>
            </div>
        );
    }
}

export default App;