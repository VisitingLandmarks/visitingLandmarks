import React from 'react';
import DialogUserPassword from './userPassword';

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