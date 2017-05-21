import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {injectIntl, intlShape} from 'react-intl';

import DialogUserPassword from './userPassword';

import {resetPasswordThunk, resettingPassword} from '../../redux/action/thunk/resetPassword';
import {navigateTo} from '../../redux/action/ui';
import {failure, inProgress, success} from '../../redux/reducer/communication';

import {routes} from '../../modules/routes';

class ResetPassword extends React.Component {

    render () {
        // @todo: display nicer feedback
        // @todo: this will prevent the dialog from reopening - all commuication thunks should go into initial state when done.
        if (this.props.done) {
            return null;
        }

        return (
            <DialogUserPassword
                {...this.props}
                open
                dialogName={this.props.intl.formatMessage({id: 'dialog.resetPassword.title'})}
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
    intl: intlShape.isRequired,
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
)(injectIntl(ResetPassword));
