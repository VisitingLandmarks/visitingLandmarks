import config from '../../../config';

import React from 'react';
import {injectIntl, intlShape} from 'react-intl';

import RaisedButton from 'material-ui/RaisedButton';

import {routes} from '../../modules/routes';

const style = {
    button: {
        width: '100%',
        marginTop: 10,
    },
    backgroundColor: '#3b5998',
};

const Facebook = (props) => {
    if (!config.authProvider.facebook) {
        return null;
    }

    return <RaisedButton
        href={routes.auth.facebook.entry}
        backgroundColor={style.backgroundColor}
        label={props.intl.formatMessage({id: 'dialog.auth.facebook'})}
        style={style.button}
    ></RaisedButton>;
};

Facebook.propTypes = {
    intl: intlShape.isRequired,
};

export default injectIntl(Facebook);