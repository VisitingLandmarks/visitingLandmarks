import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import {FormattedMessage} from 'react-intl';
import {updateIntl} from 'react-intl-redux';

import flattenObject from '../../modules/flattenObject';

import MenuItem from 'material-ui/MenuItem';

const LanguageSelect = (props) => {
    return ( <MenuItem
        menuItems={Object.keys(props.intl).map((locale) => {
            return (<MenuItem
                checked={locale === props.current}
                insetChildren={true}
                onTouchTap={() => {
                    props.changeLanguage({
                        locale,
                        messages : flattenObject(props.intl[locale]),
                    });
                }}
            >
                <FormattedMessage id={`language.${locale}`}/>
            </MenuItem>);
        })}
    >
        <FormattedMessage id='menu.language'/>
    </MenuItem>);
};

LanguageSelect.propTypes = {
    intl: PropTypes.object.isRequired,
    current: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
    return {
        intl: state.data.intl,
        current: state.intl.locale,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        changeLanguage: (locale) => dispatch(updateIntl(locale)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LanguageSelect);
