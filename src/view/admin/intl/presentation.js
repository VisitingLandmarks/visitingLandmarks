import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import flattenObject from '../../../modules/flattenObject';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import omit from 'lodash/omit';

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import { TextField } from 'redux-form-material-ui';
import { Field, reduxForm } from 'redux-form';
import { success } from '../../../redux/reducer/communication';

import setAdminDataThunk, { settingAdminData } from '../../../redux/action/thunk/setAdminData';

const onlyUnique = (value, index, self) => self.indexOf(value) === index;

const columnIndex = 'locale';
const dontShow = ['locale', '__v', '_id', 'updatedAt', 'createdAt'];

const AdminIntl = (props) => {
    const {languages, allKeys, flatByLanguage} = props;
    const {formatMessage} = props.intl;

    const head =
        <TableHeader displaySelectAll={false}>
            <TableRow>
                {languages.map((lang) => <TableHeaderColumn key={lang}><FormattedMessage
                    id={`language.${lang}`} /></TableHeaderColumn>)}
            </TableRow>
        </TableHeader>;
    console.log(props.communication);
    const rows = allKeys.map((key) =>
        <TableRow key={key} selectable={false}>
            {languages.map((lang) =>
                <TableRowColumn key={lang}>
                    <Field
                        onBlur={(event, newValue) => {
                            if (newValue !== flatByLanguage[lang][key]) { props.handleSubmit(lang, key, newValue); }
                        }}
                        name={`${lang}.${key}`}
                        component={TextField}
                        floatingLabelText={`${key} ${props.communication && props.communication[lang] && props.communication[lang][key + '.' + success] && formatMessage({id: 'admin.saved'}) || ''}`}
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
    communication: PropTypes.object,
    data: PropTypes.arrayOf(PropTypes.object),
    flatByLanguage: PropTypes.object,
    languages: PropTypes.arrayOf(PropTypes.string),
    allKeys: PropTypes.arrayOf(PropTypes.string),
    intl: intlShape.isRequired,

};

const mapStateToProps = (state, props) => {
    const languages = props.data.map((data) => data[columnIndex]);
    const flatByLanguage = languages.reduce((obj, lang, idx) => {
        obj[lang] = omit(flattenObject(props.data[idx].messages), dontShow);
        return obj;
    }, {});

    const allKeys = Object.values(flatByLanguage).reduce((arr, flatByLang) => {
        arr.push.apply(arr, Object.keys(flatByLang));
        return arr;
    }, []).filter(onlyUnique).sort();

    const initialValues = languages.reduce((obj, lang, idx) => {
        obj[lang] = omit(props.data[idx].messages, dontShow);
        return obj;
    }, {});

    return {
        allKeys,
        languages,
        initialValues,
        flatByLanguage,
        communication: languages.reduce((obj, lang, idx) => {
            obj[lang] = flattenObject(state.communication[settingAdminData] && state.communication[settingAdminData].intl && state.communication[settingAdminData].intl[lang] || {});
            return obj;
        }, {}),

    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleSubmit: (lang, key, newValue) => dispatch(setAdminDataThunk('intl', lang, key, newValue)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(reduxForm({
    form: 'AdminIntl', // a unique name for this form
})(injectIntl(AdminIntl)));
