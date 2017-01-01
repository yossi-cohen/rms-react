import React, { Component } from 'react';
import { AutoComplete } from 'material-ui';
import JSONP from 'jsonp';
import YoutubeFinder from 'youtube-finder';

const googleAutoSuggestURL = `//suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=`;

class MuiAutocomplete extends Component {
    constructor(props) {
        super(props);

        this.onUpdateInput = this.onUpdateInput.bind(this);
        this.onNewRequest = this.onNewRequest.bind(this);

        this.YoutubeClient  = YoutubeFinder.createClient({ key: 'AIzaSyDdJyARRERZxxe08iPNZ-2YR3YVro-iDJA' });

        this.state = {
            dataSource: [],
            inputValue: ''
        }
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

    render() {
        return (
            <AutoComplete
                searchText={this.state.inputValue}
                floatingLabelText={this.props.placeHolder}
                filter={AutoComplete.noFilter}
                openOnFocus={true}

                dataSource={this.state.dataSource}
                onUpdateInput={this.onUpdateInput}
                onNewRequest={this.onNewRequest}
                />
        );
    }
}

export default MuiAutocomplete;
