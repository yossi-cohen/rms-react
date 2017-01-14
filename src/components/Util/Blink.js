var blacklist = require('blacklist');
var React = require('react');

var Blink = React.createClass({
    propTypes: {
        children: React.PropTypes.node.isRequired,
        duration: React.PropTypes.number
    },

    getInitialState() {
        return { visible: true };
    },

    getDefaultProps() {
        return { duration: 1000 };
    },

    blink() {
        if (!this.isMounted())
            return;
        this.setState({ visible: !this.state.visible });
        setTimeout(this.blink, this.props.duration);
    },

    componentDidMount() {
        this.blink();
    },

    render() {
        const props = blacklist(this.props, 'children', 'duration');
        props.style = { visibility: this.state.visible ? 'visible' : 'hidden' };
        return (
            <span {...props}>{this.props.children}</span>
        );
    }
});

export default Blink;
