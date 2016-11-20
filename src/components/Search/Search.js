import React from 'react';
import { connect } from "react-redux";
import { Form, Control, Field, actions } from 'react-redux-form';
import validator from 'validator';
import {
    AutoComplete,
    Card,
    CardActions,
    CardHeader,
    CardText,
    DatePicker,
    RaisedButton,
    TimePicker,
    Toggle
} from 'material-ui';

import SearchResult from './SearchResult';
import { fetchVideos } from '../../actions/fetchVideos';
import { searchVideos } from '../../actions/searchVideos';

//lilox
// const isRequired = (value) => !validator.isNull('' + value);
const isRequired = (value) => null != value;

@connect((store) => {
    return {
        videos: store.videos.videos,
        searchResult:store.searchResult.videos 
    };
})

class Search extends React.Component {
    constructor(props) {
        super(props);

        this.searchTextValid = this.searchTextValid.bind(this);
        this.startDateValid = this.startDateValid.bind(this);
        this.endtDateValid = this.endDateValid.bind(this);

        // min/max date
        const minDate = new Date();
        const maxDate = new Date();
        minDate.setFullYear(minDate.getFullYear() - 1);
        minDate.setHours(0, 0, 0, 0);
        maxDate.setFullYear(maxDate.getFullYear() + 1);
        maxDate.setHours(0, 0, 0, 0);

        this.state = this.initialState = {
            //lilox
            // searchTerm: '',
            // suggestions: [],
            minDate: minDate,
            maxDate: maxDate,
            autoOk: false,
        };
    }

    componentWillMount() {
        this.props.dispatch(fetchVideos());
    }

    render() {
        // console.log('lilox (searchResult)', this.props.searchResult);
        let { search, searchForm, dispatch, videos } = this.props;

        let formStyle = {
            textAlign: 'center',
            height: '100%'
        };

        let style = {
            display: 'inline-block'
        };

        return (
            <div>
                <Form model="search"
                    style={formStyle}
                    className="search"
                    onSubmit={(v) => this.handleSubmit(v)}
                    >
                    <Card>
                        <CardHeader
                            actAsExpander={true}
                            showExpandableButton={true}
                            />
                        <CardText>
                            <Field model="search.text"
                                validators={{
                                    isRequired,
                                    length: (v) => v && v.length >= 3,
                                }}
                                validateOn="blur"
                                style={style}>
                                <AutoComplete
                                    autoFocus
                                    name="searchText"
                                    ref='autoComplete'
                                    openOnFocus={false}
                                    hintText="Search by name"
                                    floatingLabelText="Search by name"
                                    filter={AutoComplete.fuzzyFilter}
                                    dataSource={videos}
                                    maxSearchResults={5}
                                    onUpdateInput={v => dispatch(actions.change('search.text', v))}
                                    onNewRequest={this.handleChangeSearchTerm.bind(this)}
                                    />
                            </Field>
                        </CardText>
                        <CardActions expandable={true}>
                            <Field model="search.startDate" style={style}>
                                <DatePicker
                                    ref="startDate"
                                    hintText="Start Date"
                                    floatingLabelText="Start Date"
                                    autoOk={this.state.autoOk}
                                    container="inline"
                                    value={this.props.search.startDate}
                                    onChange={(event, date) => this.handleChangeStartDate(event, date)}
                                    />
                            </Field>
                            <Field model="search.startTime" style={style}>
                                <TimePicker
                                    ref="startTime"
                                    hintText="Start Time"
                                    floatingLabelText="Start Time"
                                    disabled={!this.startDateValid()}
                                    onChange={(event, time) => this.handleChangeStartTime(event, time)}
                                    />
                            </Field>
                            <p />
                            <Field model="search.endDate" style={style}>
                                <DatePicker
                                    ref="endDate"
                                    hintText="End Date"
                                    floatingLabelText="End Date"
                                    autoOk={this.state.autoOk}
                                    minDate={this.state.minDate}
                                    container="inline"
                                    disabled={!this.startDateValid()}
                                    value={this.props.search.endDate}
                                    onChange={(event, date) => this.handleChangeEndDate(event, date)}
                                    />
                            </Field>
                            <Field model="search.endTime" style={style}>
                                <TimePicker
                                    ref="endTime"
                                    hintText="End Time"
                                    floatingLabelText="End Time"
                                    disabled={!this.endDateValid()}
                                    onChange={(event, time) => this.handleChangeEndTime(event, time)}
                                    />
                            </Field>
                        </CardActions>
                        <CardActions>
                            <RaisedButton label="Search" type="submit" primary={true} style={style} />
                        </CardActions>
                    </Card>
                </Form>
                <SearchResult videos={this.props.searchResult}/>
            </div>
        );
    }

    // ---------------------------------------------------
    // event handlers
    // ---------------------------------------------------

    // fired when selection changes or <enter> key pressed
    handleChangeSearchTerm(value, index) {
        if (index >= 0) { // otherwise <enter> key was pressed (which triggers submit)
            this.refs.autoComplete.focus();
        }
    }

    handleChangeStartDate(event, date) {
        if (this.startDateValid(date)) {
            this.props.dispatch(actions.change('search.startDate', date));
            this.setState({ minDate: date });
        }

        // reset endDate if became invalid
        if (null != this.props.search.endDate && !this.isEqualOrAfter(this.props.search.endDate, date)) {
            this.props.dispatch(actions.change('search.endDate', null));
        }
    }

    handleChangeStartTime(event, time) {
        this.props.dispatch(actions.change('search.startTime', time));
    }

    handleChangeEndDate(event, date) {
        if (this.endDateValid(date)) {
            this.props.dispatch(actions.change('search.endDate', date));
            this.setState({ maxDate: date });
        }
    }

    handleChangeEndTime(event, time) {
        this.props.dispatch(actions.change('search.endTime', time));
    }

    handleSubmit(searchTerm) {
        this.props.dispatch(searchVideos(searchTerm));
    }

    // ---------------------------------------------------
    // validation helpers
    // ---------------------------------------------------

    searchTextValid(text) {
        return !validator.isEmpty(validator.trim(text));
    }

    startDateValid(date) {
        let startDate = null != date ? date : this.props.search.startDate;
        let endDate = this.props.search.endDate;
        let ret = this.dateValid(startDate);
        return ret;
    }

    endDateValid(date) {
        let endDate = null != date ? date : this.props.search.endDate;
        let ret = this.dateValid(endDate) && this.isEqualOrAfter(endDate, this.state.minDate);
        return ret;
    }

    dateValid(date) {
        return null != date && validator.isDate(date.toString());
    }

    // isEqualOrAfter(date1 date2) - check if date1 is equal or after date2.
    isEqualOrAfter(date1, date2) {
        return null != date1 && null != date2 && (date1.toString() == date2.toString() || validator.isAfter(date1.toString(), date2.toString()));
    }

    // isEqualOrBefore(date1 date2) - check if date1 is equal or before date2.
    isEqualOrBefore(date1, date2) {
        return null != date1 && null != date2 && (date1.toString() == date2.toString() || validator.isBefore(date1.toString(), date2.toString()));
    }
}

export default connect((state) => ({ search: state.search }))(Search);
