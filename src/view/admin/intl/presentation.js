import React from 'react';
import PropTypes from 'prop-types';

import flattenObject from '../../../modules/flattenObject';
import { FormattedMessage } from 'react-intl';

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

const onlyUnique = (value, index, self) => self.indexOf(value) === index;

const AdminIntl = (props) => {
    debugger;
    const languages = Object.keys(props.data);

    const head =
        <TableHeader>
            <TableRow>
                <TableHeaderColumn><FormattedMessage id='admin.intl.key' /></TableHeaderColumn>
                {languages.map((lang) => <TableHeaderColumn key={lang}>{lang}</TableHeaderColumn>)}
            </TableRow>
        </TableHeader>;

    const flatByLanguage = languages.reduce((obj, lang) => {
        obj[lang] = flattenObject(props.data[lang]);
        return obj;
    }, {});

    const allKeys = Object.values(flatByLanguage).reduce((arr, flatByLang) => {
        arr.push.apply(arr, Object.keys(flatByLang));
        return arr;
    }, []).filter(onlyUnique);

    const rows = allKeys.map((key) =>
        <TableRow key={key}>
            <TableRowColumn>{key}</TableRowColumn>
            {languages.map((lang) =>
                <TableRowColumn key={lang}>
                    {flatByLanguage[lang][key]}
                </TableRowColumn>)}
        </TableRow>);

    return (
        <Table selectable={false}>
            {head}
            <TableBody stripedRows>
                {rows}
            </TableBody>
        </Table>
    );
};

AdminIntl.propTypes = {
    data: PropTypes.object,
};

export default AdminIntl;
