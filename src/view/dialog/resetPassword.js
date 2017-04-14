import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import DialogUserPassword from './userPassword';

import {resetPasswordThunk, resettingPassword} from '../../redux/action/thunk/resetPassword';
import {navigateTo} from '../../redux/action/ui';
import {failure, inProgress, success} from '../../redux/reducer/communication';

import routes from '../../../config/routes';

class ResetPassword extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        if (this.props.done) {
            return null;
        }

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
    done: PropTypes.bool.isRequired,
    onCloseDialog: PropTypes.func.isRequired,
    requestResetPassword: PropTypes.func.isRequired,
};
ResetPassword.contextTypes = {
    router: PropTypes.object,
};


const mapStateToProps = (state) => {
    return {
        done: state.communication[resettingPassword][success] || false,
        disabled: state.communication[resettingPassword][inProgress] || false,
        error: state.communication[resettingPassword][failure] || false,
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