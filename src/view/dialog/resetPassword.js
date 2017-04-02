import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

import DialogUserPassword from './userPassword';

import {resetPasswordThunk, resettingPassword} from '../../redux/action/thunk/resetPassword';
import {navigateTo} from '../../redux/action/ui';
import {failure, inProgress} from '../../redux/reducer/communication';

import routes from '../../../config/routes';

class ResetPassword extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <DialogUserPassword
                {...this.props}
                open={true}
                dialogName="Forgot Password?"
                showPasswordLine={false}
                onSubmit={this.props.requestResetPassword}
            />
        );
    }

}

ResetPassword.propTypes = {
    onCloseDialog: PropTypes.func.isRequired,
    requestResetPassword: PropTypes.func.isRequired,
};
ResetPassword.contextTypes = {
    router: React.PropTypes.object,
};


const mapStateToProps = (state) => {
    return {
        disabled: state.communication[resettingPassword][inProgress],
        error: state.communication[resettingPassword][failure],
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onCloseDialog: () => dispatch(navigateTo(routes.root)),
        requestResetPassword: (username) => dispatch(resetPasswordThunk({username})),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ResetPassword);




{/*<DialogResetPassword*/}
{/*open={this.props.openDialog.passwordReset}*/}
{/*onCloseDialog={this.props.onCloseDialog}*/}
{/*onSubmit={this.props.requestResetPassword}*/}
{/*/>*/}