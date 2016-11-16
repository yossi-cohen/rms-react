import React from 'react';
import { connect } from "react-redux";
import { Form, Control, Field, actions } from 'react-redux-form';
import validator from 'validator';
import {
    AutoComplete,
    DatePicker,
    RaisedButton,
    TimePicker,
} from 'material-ui';
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

        let formStyle = {
            textAlign: 'center',
            height: '100%'
        };

        let style = {
            display: 'inline-block'
        };

        return (
            <Form model="search" onSubmit={(v) => this.handleSubmit(v)} style={formStyle}>
                <Field model="search.text"
                    validators={{
                        isRequired,
                        length: (v) => v && v.length >= 3,
                    }}
                    validateOn="blur"
                    style={style}>
                    <AutoComplete
                        name="searchText"
                        ref={focusNameInputField} ref='autoComplete'
                        floatingLabelText=""
                        openOnFocus={false}
                        hintText="Search Text"
                        filter={AutoComplete.fuzzyFilter}
                        dataSource={this.props.videos}
                        maxSearchResults={5}
                        onUpdateInput={v => dispatch(actions.change('search.text', v))}
                        onNewRequest={this.handleNewRequest.bind(this)}
                        />
                </Field>
                <p />
                <Field model="search.startDate" style={style}>
                    <DatePicker
                        ref="startDate"
                        hintText="Start Date"
                        autoOk={true}
                        container="inline"
                        onChange={(event, date) => dispatch(actions.change('search.startDate', date))}
                        />
                </Field>
                <Field model="search.startTime" style={style}>
                    <TimePicker
                        ref="startTime"
                        hintText="Start Time"
                        onChange={(event, time) => dispatch(actions.change('search.startTime', time))}
                        />
                </Field>
                <p />
                <Field model="search.endDate" style={style}>
                    <DatePicker
                        ref="endDate"
                        hintText="End Date"
                        autoOk={true}
                        container="inline"
                        onChange={(event, date) => dispatch(actions.change('search.endDate', date))}
                        />
                </Field>
                <Field model="search.endTime" style={style}>
                    <TimePicker
                        ref="endTime"
                        hintText="End Time"
                        onChange={(event, time) => dispatch(actions.change('search.endTime', time))}
                        />
                </Field>
                <p />
                <p />
                <RaisedButton label="Search" type="submit" primary={true} style={style} />
            </Form>
        );
    }

    // fired when selection changes or <enter> key pressed
    handleNewRequest(value, index) {
        if (index >= 0) { // otherwise <enter> key was pressed (which triggers submit)
            //lilox: this.handleSubmit();
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