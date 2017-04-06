import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

import routes from '../../../config/routes';

const style = {
    button: {
        width: '100%',
        marginTop:10,
    },
    backgroundColor: '#fff',
    labelColor:'#000',
};

const google = (props) => {
    return <RaisedButton
        href={routes.auth.google.entry}
        backgroundColor={style.backgroundColor}
        label="Sign In with Google"
        labelColor={style.labelColor}
        style={style.button}
    ></RaisedButton>;
};

export default google;