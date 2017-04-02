import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

import DialogUserPassword from './userPassword';

import {loginThunk, loggingIn} from '../../redux/action/thunk/login';
import {navigateTo} from '../../redux/action/ui';
import {failure, inProgress} from '../../redux/reducer/communication';

import routes from '../../../config/routes';

export const dialogName = 'Login';

class DialogLogin extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <DialogUserPassword
                {...this.props}
                open={true}
                dialogName={dialogName}
                onCloseDialog={this.props.onCloseDialog}
                onSubmit={this.props.requestLogin}
            />
        );
    }

}

DialogLogin.propTypes = {
    requestLogin: PropTypes.func.isRequired,
    onCloseDialog: PropTypes.func.isRequired,
};
DialogLogin.contextTypes = {
    router: React.PropTypes.object,
};


const mapStateToProps = (state) => {
    return {
        disabled: state.communication[loggingIn][inProgress],
        error: state.communication[loggingIn][failure],
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onCloseDialog: () => dispatch(navigateTo(routes.root)),
        requestLogin: (username, password) => dispatch(loginThunk({username, password})),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DialogLogin);
