import React from 'react';
import { connect } from "react-redux";
import { Form, Control, Field, actions } from 'react-redux-form';
import validator from 'validator';
import { AutoComplete } from 'material-ui'
import { fetchVideos } from '../../actions/videoActions';

const focusNameInputField = ref => {
    if (ref) {
        ref.focus();
    }
};

const isRequired = (value) => !validator.isNull('' + value);

@connect((store) => {
    return {
        videos: store.videos.videos
    };
})

class Search extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.dispatch(fetchVideos());
    }

    render() {
        let { search, searchForm, dispatch } = this.props;

        return (
            <Form model="search" onSubmit={(v) => this.handleSubmit(v)}>
                <Field model="search.text"
                    validators={{
                        isRequired,
                        length: (v) => v && v.length >= 3,
                    }}
                    validateOn="blur">
                    <AutoComplete
                        name="searchText"
                        ref={focusNameInputField} ref='autoComplete'
                        floatingLabelText=""
                        openOnFocus={false}
                        hintText="Enter text here"
                        filter={AutoComplete.fuzzyFilter}
                        dataSource={this.props.videos}
                        maxSearchResults={5}
                        onUpdateInput={v => dispatch(actions.change('search.text', v))}
                        onNewRequest={this.handleNewRequest.bind(this)}
                        />
                </Field>
                <button>Search</button>
            </Form>
        );
    }

    // fired when selection changes or <enter> key pressed
    handleNewRequest(value, index) {
        if (index >= 0) { // otherwise <enter> key was pressed (which triggers submit)
            this.handleSubmit();
            this.refs.autoComplete.focus();
        }
    }

    handleSubmit(values) {
        //lilox:TODO
        if (!values)
            values = this.props.search;
        console.log('submit: ', values);
    }
}

export default connect((state) => ({ search: state.search }))(Search);