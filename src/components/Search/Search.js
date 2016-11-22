import React from 'react';
import { connect } from "react-redux";
import { Form, Control, Field, actions } from 'react-redux-form';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index'
import {
    AutoComplete,
    Card,
    CardActions,
    CardHeader,
    CardMedia,
    CardText,
    CardTitle,
    DatePicker,
    RaisedButton,
    TimePicker
} from 'material-ui';
import validator from 'validator';
import GeoJsonPicker from './GeoJsonPicker';
import SearchResult from './SearchResult';
import VideoPlayer from '../Video/VideoPlayer';
import { fetchVideos } from '../../actions/fetchVideos';
import { searchVideos } from '../../actions/searchVideos';

const isRequired = (value) => !validator.isNull('' + value);

const styles = {
    form: {
        textAlign: 'center',
        height: '100%'
    },

    dateTimeFields: {
        display: 'inline-block'
    },

    card: {
        borderStyle: 'none',
        boxShadow: 'none',
    }
}

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
            expanded: false,
            minDate: minDate,
            maxDate: maxDate,
            autoOk: false,
        };
    }

    componentWillMount() {
        this.props.dispatch(fetchVideos());
    }

    render() {
        let { search, searchForm, dispatch, videos } = this.props;

        return (
            <div>
                <Form model="search"
                    style={styles.form}
                    className="search"
                    onSubmit={(v) => this.handleSubmit(v)}
                    >
                    <Card
                        expanded={this.state.expanded}
                        onExpandChange={(expanded) => this.setState({ expanded: expanded })}
                        style={styles.card}
                        >
                        <CardHeader
                            actAsExpander={true}
                            showExpandableButton={true}
                            />
                        <CardActions>
                            <Field model="search.text"
                                validators={{
                                    isRequired,
                                    length: (v) => v && v.length >= 3,
                                }}
                                validateOn="blur">
                                <AutoComplete
                                    autoFocus
                                    name="searchText"
                                    ref='autoComplete'
                                    openOnFocus={false}
                                    hintText="Search video by name"
                                    filter={AutoComplete.fuzzyFilter}
                                    dataSource={videos}
                                    maxSearchResults={5}
                                    onUpdateInput={v => dispatch(actions.change('search.text', v))}
                                    onNewRequest={this.handleChangeSearchTerm.bind(this)}
                                    />
                            </Field>
                        </CardActions>
                        <CardActions expandable={true}>
                            <Field model="search.startDate" style={styles.dateTimeFields}>
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
                            <Field model="search.startTime" style={styles.dateTimeFields}>
                                <TimePicker
                                    ref="startTime"
                                    hintText="Start Time"
                                    floatingLabelText="Start Time"
                                    disabled={!this.startDateValid()}
                                    onChange={(event, time) => this.handleChangeStartTime(event, time)}
                                    />
                            </Field>
                            <p />
                            <Field model="search.endDate" style={styles.dateTimeFields}>
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
                            <Field model="search.endTime" style={styles.dateTimeFields}>
                                <TimePicker
                                    ref="endTime"
                                    hintText="End Time"
                                    floatingLabelText="End Time"
                                    disabled={!this.endDateValid()}
                                    onChange={(event, time) => this.handleChangeEndTime(event, time)}
                                    />
                            </Field>
                        </CardActions>
                        <CardActions expandable={true}>
                            <Field model="search.geoJson" style={styles.dateTimeFields}>
                                <GeoJsonPicker />
                            </Field>
                        </CardActions>
                        <CardActions>
                            <RaisedButton label="Search" type="submit" primary={true} />
                        </CardActions>
                    </Card>
                </Form>
                <Grid>
                    <Row>
                        <Col>
                            <SearchResult videos={this.props.searchResult} />
                        </Col>
                        <Col>
                            <VideoPlayer />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
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

    // check if date1 is equal or after date2.
    isEqualOrAfter(date1, date2) {
        return null != date1 && null != date2 && (date1.toString() == date2.toString() || validator.isAfter(date1.toString(), date2.toString()));
    }

    // check if date1 is equal or before date2.
    isEqualOrBefore(date1, date2) {
        return null != date1 && null != date2 && (date1.toString() == date2.toString() || validator.isBefore(date1.toString(), date2.toString()));
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
        this.setState({ expanded: false });
        this.props.dispatch(playVideo(null));
        this.props.dispatch(searchVideos(searchTerm));
    }
}

export default connect((store) => ({
    search: store.search,
    videos: store.videos.videos,
    searchResult: store.searchResult.videos
}))(Search);

