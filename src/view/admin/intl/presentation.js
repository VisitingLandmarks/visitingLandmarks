import React from 'react';
import PropTypes from 'prop-types';

import flattenObject from '../../../modules/flattenObject';
import { FormattedMessage } from 'react-intl';
import omit from 'lodash/omit';

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import TextField from 'material-ui/TextField';

const onlyUnique = (value, index, self) => self.indexOf(value) === index;

const columnIndex = 'locale';
const dontShow = ['locale', '__v', '_id', 'updatedAt', 'createdAt'];

const AdminIntl = (props) => {
    const languages = props.data.map((data) => data[columnIndex]);

    const head =
        <TableHeader displaySelectAll={false}>
            <TableRow>
                <TableHeaderColumn><FormattedMessage id='admin.intl.key' /></TableHeaderColumn>
                {languages.map((lang) => <TableHeaderColumn key={lang}>{lang}</TableHeaderColumn>)}
            </TableRow>
        </TableHeader>;

    const flatByLanguage = languages.reduce((obj, lang, idx) => {
        obj[lang] = omit(flattenObject(props.data[idx]), dontShow);
        return obj;
    }, {});

    const allKeys = Object.values(flatByLanguage).reduce((arr, flatByLang) => {
        arr.push.apply(arr, Object.keys(flatByLang));
        return arr;
    }, []).filter(onlyUnique);

    const rows = allKeys.map((key) =>
        <TableRow key={key} selectable={false}>
            <TableRowColumn>{key}</TableRowColumn>
            {languages.map((lang) =>
                <TableRowColumn key={lang}>
                    <TextField
                        defaultValue={flatByLanguage[lang][key]} onBlur={function (...args) {
                            debugger;
                            console.log(args);
                        }}
                    />
                </TableRowColumn>)}
        </TableRow>);

    return (
        <Table>
            {head}
            <TableBody stripedRows displayRowCheckbox={false}>
                {rows}
            </TableBody>
        </Table>
    );
};

AdminIntl.propTypes = {
    data: PropTypes.object,
};
export default AdminIntl;
