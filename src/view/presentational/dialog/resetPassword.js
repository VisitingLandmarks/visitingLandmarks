import React, {PropTypes} from 'react';
import DialogUserPassword from './userPassword';

export const dialogName = 'Reset Password';

export default class DialogLogin extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <DialogUserPassword
                dialogName={dialogName}
                showPasswordLine={false}
                {...this.props}
            />
        );
    }

}