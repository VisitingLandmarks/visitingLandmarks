import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

import routes from '../../../config/routes';

const style = {
    button: {
        width: '100%',
    },
    facebookBlue: '#3b5998',
};

const facebook = (props) => {
    return <RaisedButton
        href={routes.auth.facebook.entry}
        backgroundColor={style.facebookBlue}
        label="Register and Login with Facebook"
        style={style.button}
    ></RaisedButton>;
};

export default facebook;