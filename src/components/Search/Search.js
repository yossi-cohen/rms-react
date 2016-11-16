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

const dataSourceConfig = {
    text: 'title',
    value: 'vid',
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
                        ref={focusNameInputField}
                        floatingLabelText=""
                        openOnFocus={false}
                        hintText="Enter text here"
                        filter={AutoComplete.fuzzyFilter}
                        dataSource={this.props.videos}
                        dataSourceConfig={dataSourceConfig}
                        maxSearchResults={5}
                        onUpdateInput={v => dispatch(actions.change('search.text', v))}
                        />
                </Field>
                <button>Search</button>
            </Form>
        );
    }

    handleSubmit(values) {
        //lilox:TODO
        console.log('submit: ', values);
    }
}

export default connect((state) => ({ search: state.search }))(Search);