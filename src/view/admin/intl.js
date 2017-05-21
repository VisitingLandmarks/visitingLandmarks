import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import flattenObject from '../../modules/flattenObject';
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

class AdminIntl extends React.Component {

    render () {
        const languages = Object.keys(this.props.data);

        const head =
            <TableHeader>
                <TableRow>
                    <TableHeaderColumn><FormattedMessage id='admin.intl.key' /></TableHeaderColumn>
                    {languages.map((lang) => <TableHeaderColumn key={lang}>{lang}</TableHeaderColumn>)}
                </TableRow>
            </TableHeader>;

        const flatByLanguage = languages.reduce((obj, lang) => {
            obj[lang] = flattenObject(this.props.data[lang]);
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
    }

}

AdminIntl.propTypes = {
    data: PropTypes.object.isRequired,

};

const mapStateToProps = (state) => {
    return {
        data: state.data.intl,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AdminIntl);
