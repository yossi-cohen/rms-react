import React from 'react';
import DatePicker from 'material-ui/DatePicker';
import FlatButton from 'material-ui/FlatButton';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

export default class DateTimePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            controlledDateFrom: null,
            controlledDateTo: null
        };
    }

    render() {
        return (
            <div>
                <Table
                    selectable={false}
                    >
                    <TableBody
                        displayRowCheckbox={false}
                        >
                        <TableRow>
                            <TableRowColumn>
                                <FlatButton
                                    label="From Date"
                                    primary={true}
                                    onTouchTap={this.handleSelectFromDate}
                                    style={{ display: 'inline-block' }}
                                    />
                            </TableRowColumn>
                            <TableRowColumn>
                                <DatePicker
                                    ref="datePickerFrom"
                                    hintText="select..."
                                    value={this.state.controlledDateFrom}
                                    onChange={this.handleChange}
                                    style={{ display: 'inline-block' }}
                                    />
                            </TableRowColumn>
                        </TableRow>
                    </TableBody>
                </Table>
                <FlatButton
                    label="From Date"
                    primary={true}
                    onTouchTap={this.handleSelectFromDate}
                    style={{ display: 'inline-block' }}
                    />
                <DatePicker
                    ref="datePickerFrom"
                    hintText="select..."
                    value={this.state.controlledDateFrom}
                    onChange={this.handleChange}
                    style={{ display: 'inline-block' }}
                    />
                <br />
                <FlatButton
                    label="To Date"
                    primary={false}
                    onTouchTap={this.handleSelectToDate}
                    style={{ display: 'inline-block' }}
                    />
                <DatePicker
                    ref="datePickerTo"
                    hintText="select..."
                    value={this.state.controlledDateTo}
                    onTouchTap={this.handleClickTo}
                    onChange={this.handleChangeTo}
                    style={{ display: 'inline-block' }}
                    />
            </div>
        );
    }

    handleChange = (event, date) => {
        this.setState({
            controlledDateFrom: date
        });
    };

    handleChangeTo = (event, date) => {
        this.setState({
            controlledDateTo: date
        });
    };

    handleClickTo = (event) => {
        if (null == this.state.controlledDateTo) {
            console.log('lilox -------------------- ' + this.state.controlledDateFrom);
            this.refs.datePickerTo.value = this.state.controlledDateFrom;
        }
    }

    handleSelectFromDate = (event) => {
        this.refs.datePickerFrom.openDialog()
    }

    handleSelectToDate = (event) => {
        this.refs.datePickerTo.openDialog()
    }
}
