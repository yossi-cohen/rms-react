import React from 'react';

import AutoComplete from 'material-ui/AutoComplete';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

const styles = {
    container: {
        textAlign: 'center',
        paddingTop: 200,
    },
};

//lilox:TODO - auto-complete data source (should come from server)
const dataSource = [
  {textKey: 'Material UI', valueKey: 'value-1'},
  {textKey: 'Elemental UI', valueKey: 'value-2'},
  {textKey: 'Grommet', valueKey: 'value-3'},
  {textKey: 'Mui', valueKey: 'value-4'},
  {textKey: 'Rebass', valueKey: 'value-5'},
];

const dataSourceConfig = {
  text: 'textKey',
  value: 'valueKey',
};

const focusNameInputField = ref => {
    if (ref)
        ref.focus();
};

export default class SearchDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = { open: this.props ? this.props.open : false }
    }

    render() {
        const standardActions = (
            <FlatButton
                label="Ok"
                primary={true}
                onTouchTap={this.handleCloseSearch.bind(this)}
                />
        );
        
        return (
            <div style={styles.container}>
                <Dialog
                        ref="dialog"
                        title="Search"
                        open={this.state.open}
                        actions={standardActions}
                        onRequestClose={this.handleCloseSearch.bind(this)}
                        >
                        <AutoComplete
                            ref={focusNameInputField}
                            hintText="Type something ..."
                            filter={AutoComplete.fuzzyFilter}
                            dataSource={dataSource}
                            dataSourceConfig={dataSourceConfig}
                            maxSearchResults={5}
                        />
                </Dialog>
            </div>
        );
    }

    handleCloseSearch() {
        console.log('Search: handleCloseSearch')
        this.setState({ open: false });
    };
}
