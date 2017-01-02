import React from 'react';
import { connect } from "react-redux";
import validator from 'validator';
import SearchResult from './SearchResult';
import { searchVideos } from 'actions/searchActions';
import { stopVideo } from 'actions/videoActions';
import { Form, Control, Field, actions } from 'react-redux-form';
import JSONP from 'jsonp';
import YoutubeFinder from 'youtube-finder';

import {
  AutoComplete,
  Card,
  CardActions,
  CardHeader,
  DatePicker,
  RaisedButton,
  TimePicker
} from 'material-ui';

const googleAutoSuggestURL = `//suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=`;

const isRequired = (value) => !validator.isNull('' + value);

const styles = {
  card: {
    borderStyle: 'none',
    boxShadow: 'none',
  },

  submit: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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

    this.onUpdateInput = this.onUpdateInput.bind(this);
    this.onNewRequest = this.onNewRequest.bind(this);
    this.YoutubeClient = YoutubeFinder.createClient({ key: 'AIzaSyDdJyARRERZxxe08iPNZ-2YR3YVro-iDJA' });

    this.state = this.initialState = {
      expanded: false,
      minDate: minDate,
      maxDate: maxDate,
      autoOk: false,
      container: 'dialog', // 'inline'
      firstTimeActive: true,
      dataSource: [],
      inputValue: '',
    };
  }

  onUpdateInput(inputValue) {
    const self = this;
    this.setState({
      inputValue: inputValue
    }, function () {
      self.performSearch();
    });
  }

  onNewRequest(searchTerm) {
    console.log('lilox ------------------------- onNewRequest:', searchTerm);
  }

  performSearch() {
    const self = this;
    const url = googleAutoSuggestURL + this.state.inputValue;

    if (this.state.inputValue !== '') {
      JSONP(url, function (error, data) {
        let searchResults, retrievedSearchTerms;

        if (error) return error;

        searchResults = data[1];

        retrievedSearchTerms = searchResults.map(function (result) {
          return result[0];
        });

        self.setState({
          dataSource: retrievedSearchTerms
        });
      });
    }
  }

  //lilox
  componentDidUpdate() {
    if (this.props.active && this.state.firstTimeActive) {
      this.refs.autoComplete.focus();
      this.setState({ firstTimeActive: false })
    }
  }

  render() {
    return (
      <div>
        <Form model="query" onSubmit={(v) => this.handleSubmit(v)}>
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
              <Field model="query.text"
                validators={{
                  isRequired,
                  length: (v) => v && v.length >= 3,
                }}
                validateOn="blur">
                <AutoComplete
                  ref='autoComplete'
                  searchText={this.state.inputValue}
                  floatingLabelText={this.props.placeHolder}
                  filter={AutoComplete.noFilter}
                  openOnFocus={true}
                  dataSource={this.state.dataSource}
                  onUpdateInput={this.onUpdateInput}
                  onNewRequest={this.onNewRequest}
                  />
              </Field>
            </CardActions>
            <CardActions expandable={true}>
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
              <Field model="query.startTime">
                <TimePicker
                  ref="startTime"
                  hintText="Start Time"
                  floatingLabelText="Start Time"
                  disabled={!this.startDateValid()}
                  onChange={(event, time) => this.handleChangeStartTime(event, time)}
                  />
              </Field>
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
              <Field model="query.endTime">
                <TimePicker
                  ref="endTime"
                  hintText="End Time"
                  floatingLabelText="End Time"
                  disabled={!this.endDateValid()}
                  onChange={(event, time) => this.handleChangeEndTime(event, time)}
                  />
              </Field>
            </CardActions>
            <CardActions style={styles.submit}>
              <RaisedButton label="Search" type="submit" primary={true} />
            </CardActions>
          </Card>
        </Form>
        <div>
          <SearchResult result={this.props.result} />
        </div>
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
    // this.props.dispatch(stopVideo());
    // this.props.dispatch(searchVideos(searchTerm));
    this.searchVideos2(searchTerm);
  }

  searchVideos2(searchTerm) {
    const self = this;
    const params = {
      part: 'id,snippet',
      type: 'video',
      q: searchTerm,
      maxResults: this.props.maxResults <= 10 ? this.props.maxResults : '10'
    }

    //lilox: TODO
    this.YoutubeClient.search(params, function (error, results) {
      if (error)
        return console.log(error);
      //lilox: self.props.callback(results.items, searchTerm);
      self.setState({
        dataSource: [],
        inputValue: ''
      });
    });
  }
}

export default connect((store) => ({
  query: store.search.query,
  result: store.search.result
}))(Search);
