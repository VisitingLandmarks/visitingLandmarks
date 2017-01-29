import React, {PropTypes} from 'react';
import DialogUserPassword from './userPassword';

export const dialogName = 'Register';

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