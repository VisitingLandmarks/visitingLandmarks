import React, {PropTypes} from 'react';
import DialogUserPassword from './userPassword.jsx';

export const dialogName = 'Login';

export default class DialogLogin extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <DialogUserPassword
                dialogName={dialogName}
                {...this.props}
            />
        );
    }

}