import React from 'react';

import AutoComplete from 'material-ui/AutoComplete';

//lilox:TODO - auto-complete data source (should come from server)
const dataSource = [
    { textKey: 'Material UI', valueKey: 'value-1' },
    { textKey: 'Elemental UI', valueKey: 'value-2' },
    { textKey: 'Grommet', valueKey: 'value-3' },
    { textKey: 'Mui', valueKey: 'value-4' },
    { textKey: 'Rebass', valueKey: 'value-5' },
];

const dataSourceConfig = {
    text: 'textKey',
    value: 'valueKey',
};

const focusNameInputField = ref => {
    if (ref)
        ref.focus();
};

export default class Search extends React.Component {
    constructor(props) {
        super(props);
    }

    //lilox
    componentDidMount() {
        console.log('lilox ------------------------------------------------------------------------------------');
        console.log(this.props);
        console.log('lilox ------------------------------------------------------------------------------------');
    }

    render() {
        return (
            <div className="search">
                <h1>Search</h1>
                <AutoComplete
                    ref={focusNameInputField}
                    hintText="Type something ..."
                    filter={AutoComplete.fuzzyFilter}
                    dataSource={dataSource}
                    dataSourceConfig={dataSourceConfig}
                    maxSearchResults={5}
                    />
            </div>
        );
    }
}
