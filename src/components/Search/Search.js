import React from 'react';
import AutoComplete from 'material-ui/AutoComplete';

import { connect } from "react-redux";
import { fetchVideos } from '../../actions/videoActions';

import DateTimePicker from './DateTimePicker'

const dataSourceConfig = {
    text: 'title',
    value: 'vid',
};

const focusNameInputField = ref => {
    if (ref)
        ref.focus();
};

@connect((store) => {
    return {
        videos: store.videos.videos
    };
})
export default class Search extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.dispatch(fetchVideos());
    }

    render() {
        return (
            <div className="search">
                <h1>Search</h1>
                <AutoComplete
                    ref={focusNameInputField}
                    hintText="Type something ..."
                    filter={AutoComplete.fuzzyFilter}
                    dataSource={this.props.videos}
                    dataSourceConfig={dataSourceConfig}
                    maxSearchResults={5}
                    />
                <DateTimePicker />
            </div>
        );
    }
}
