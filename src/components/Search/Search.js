import React from 'react';
import { connect } from "react-redux";

import AutoComplete from 'material-ui/AutoComplete';

import DateTimePicker from './DateTimePicker'

import { fetchVideos } from '../../actions/videoActions';

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
        // const styles = require('./Search.scss');

        // const renderInput = (field, label, showAsyncValidating) =>
        //     <div className={'form-group' + (field.error && field.touched ? ' has-error' : '')}>
        //         <label htmlFor={field.name} className="col-sm-2">{label}</label>
        //         <div className={'col-sm-8 ' + styles.inputGroup}>
        //             {showAsyncValidating && asyncValidating && <i className={'fa fa-cog fa-spin ' + styles.cog} />}
        //             <input type="text" className="form-control" id={field.name} {...field} />
        //             {field.error && field.touched && <div className="text-danger">{field.error}</div>}
        //             <div className={styles.flags}>
        //                 {field.dirty && <span className={styles.dirty} title="Dirty">D</span>}
        //                 {field.active && <span className={styles.active} title="Active">A</span>}
        //                 {field.visited && <span className={styles.visited} title="Visited">V</span>}
        //                 {field.touched && <span className={styles.touched} title="Touched">T</span>}
        //             </div>
        //         </div>
        //     </div>;

        //lilox
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

        // return (
        //     <div>
        //         <form className="form-horizontal">
        //             {renderInput(name, 'Full Name')}
        //         </form>
        //     </div>
        // );
    }
}
