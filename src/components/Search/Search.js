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
import CesiumComponent from 'components/Cesium/CesiumComponent';
import SearchResult from './SearchResult';
import { fetchVideos } from 'actions/searchActions';
import { searchVideos } from 'actions/searchActions';
import { stopVideo } from 'actions/videoActions';

const isRequired = (value) => !validator.isNull('' + value);

const styles = {
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
      container: 'dialog' // 'inline'
    };
  }

  componentWillMount() {
    this.props.dispatch(fetchVideos());
  }

  render() {
    return (
      <div>
        <Form model="query" onSubmit={(v) => this.handleSubmit(v)}>
          <Grid>
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
                <Row center="xs">
                  <Col xs={3}>
                    <Field model="query.text"
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
                        dataSource={this.props.suggestions.videos}
                        maxSearchResults={5}
                        onUpdateInput={v => this.props.dispatch(actions.change('query.text', v))}
                        onNewRequest={this.handleChangeSearchTerm.bind(this)}
                        />
                    </Field>
                  </Col>
                  <Col>
                    <RaisedButton label="Search" type="submit" primary={true} />
                  </Col>
                </Row>
              </CardActions>
              <CardActions expandable={true}>
                <Row center="xs">
                  <Col xs={3}>
                    <Field model="query.startDate">
                      <DatePicker
                        ref="startDate"
                        hintText="Start Date"
                        floatingLabelText="Start Date"
                        autoOk={this.state.autoOk}
                        container={this.state.container}
                        value={this.props.query.startDate}
                        onChange={(event, date) => this.handleChangeStartDate(event, date)}
                        />
                    </Field>
                  </Col>
                  <Col>
                    <Field model="query.startTime">
                      <TimePicker
                        ref="startTime"
                        hintText="Start Time"
                        floatingLabelText="Start Time"
                        disabled={!this.startDateValid()}
                        onChange={(event, time) => this.handleChangeStartTime(event, time)}
                        />
                    </Field>
                  </Col>
                </Row>
                <Row center="xs">
                  <Col xs={3}>
                    <Field model="query.endDate">
                      <DatePicker
                        ref="endDate"
                        hintText="End Date"
                        floatingLabelText="End Date"
                        autoOk={this.state.autoOk}
                        minDate={this.state.minDate}
                        container={this.state.container}
                        disabled={!this.startDateValid()}
                        value={this.props.query.endDate}
                        onChange={(event, date) => this.handleChangeEndDate(event, date)}
                        />
                    </Field>
                  </Col>
                  <Col>
                    <Field model="query.endTime">
                      <TimePicker
                        ref="endTime"
                        hintText="End Time"
                        floatingLabelText="End Time"
                        disabled={!this.endDateValid()}
                        onChange={(event, time) => this.handleChangeEndTime(event, time)}
                        />
                    </Field>
                  </Col>
                </Row>
                <p />
                <Row center="xs">
                  <Col>
                    <Field model="query.geoJson">
                      <CesiumComponent />
                    </Field>
                  </Col>
                </Row>
              </CardActions>
            </Card>
          </Grid>
        </Form>
        <SearchResult result={this.props.result} />
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
    let startDate = null != date ? date : this.props.query.startDate;
    let endDate = this.props.query.endDate;
    let ret = this.dateValid(startDate);
    return ret;
  }

  endDateValid(date) {
    let endDate = null != date ? date : this.props.query.endDate;
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
      this.props.dispatch(actions.change('query.startDate', date));
      this.setState({ minDate: date });
    }

    // reset endDate if became invalid
    if (null != this.props.query.endDate && !this.isEqualOrAfter(this.props.query.endDate, date)) {
      this.props.dispatch(actions.change('query.endDate', null));
    }
  }

  handleChangeStartTime(event, time) {
    this.props.dispatch(actions.change('query.startTime', time));
  }

  handleChangeEndDate(event, date) {
    if (this.endDateValid(date)) {
      this.props.dispatch(actions.change('query.endDate', date));
      this.setState({ maxDate: date });
    }
  }

  handleChangeEndTime(event, time) {
    this.props.dispatch(actions.change('query.endTime', time));
  }

  handleSubmit(searchTerm) {
    this.setState({ expanded: false });
    this.props.dispatch(stopVideo());
    this.props.dispatch(searchVideos(searchTerm));
  }
}

export default connect((store) => ({
  query: store.search.query,
  suggestions: store.search.suggestions,
  result: store.search.result
}))(Search);
