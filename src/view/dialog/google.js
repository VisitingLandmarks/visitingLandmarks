import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {injectIntl, intlShape} from 'react-intl';

import routes from '../../../config/routes';

const style = {
    button: {
        width: '100%',
        marginTop:10,
    },
    backgroundColor: '#fff',
    labelColor:'#000',
};

const Google = (props) => {
    return <RaisedButton
        href={routes.auth.google.entry}
        backgroundColor={style.backgroundColor}
        label={props.intl.formatMessage({id: 'dialog.auth.google'})}
        labelColor={style.labelColor}
        style={style.button}
    ></RaisedButton>;
};

Google.propTypes = {
    intl: intlShape.isRequired,
};


export default injectIntl(Google);