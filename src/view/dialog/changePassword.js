import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import DialogUserPassword from './userPassword';

import {changePasswordThunk, changingPassword} from '../../redux/action/thunk/changePassword';
import {navigateTo} from '../../redux/action/ui';
import {failure, inProgress} from '../../redux/reducer/communication';

import routes from '../../../config/routes';

class ChangePassword extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <DialogUserPassword
                {...this.props}
                open={true}
                dialogName="Change Password"
                showUsernameLine={false}
                onSubmit={this.props.requestChangePassword}
            />
        );
    }

}

ChangePassword.propTypes = {
    onCloseDialog: PropTypes.func.isRequired,
    requestChangePassword: PropTypes.func.isRequired,
};
ChangePassword.contextTypes = {
    router: PropTypes.object,
};


const mapStateToProps = (state) => {
    return {
        disabled: state.communication[changingPassword][inProgress],
        error: state.communication[changingPassword][failure],
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onCloseDialog: () => dispatch(navigateTo(routes.root)),
        requestChangePassword: (username, password) => dispatch(changePasswordThunk({password})),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChangePassword);