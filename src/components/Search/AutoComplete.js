import React, { Component } from 'react';
import { AutoComplete } from 'material-ui';
import JSONP from 'jsonp';

const googleAutoSuggestURL = `//suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=`;

class MaterialUIAutocomplete extends Component {
    constructor(props) {
        super(props);
        this.onUpdateInput = this.onUpdateInput.bind(this);
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
                dataSource={this.state.dataSource}
                onUpdateInput={this.onUpdateInput} />
        );
    }
}

export default MaterialUIAutocomplete;
