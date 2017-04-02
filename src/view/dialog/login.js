import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

import DialogUserPassword from './userPassword';
import {loginThunk} from '../../redux/action/thunk/login';

import {loggingIn} from '../../redux/action/thunk/login';
import {failure, inProgress} from '../../redux/reducer/communication';

export const dialogName = 'Login';

class DialogLogin extends React.Component {

    constructor(props) {
        super(props);
        this.onCloseDialog = this.onCloseDialog.bind(this);
    }

    onCloseDialog() {
        this.context.router.history.push('/');
    }

    render() {
        return (
            <DialogUserPassword
                {...this.props}
                open={true} //@todo: remove
                dialogName={dialogName}
                onCloseDialog={this.onCloseDialog}
                onSubmit={this.props.requestLogin}
            />
        );
    }

}

DialogLogin.propTypes = {
    requestLogin: PropTypes.func.isRequired,
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
        // onCloseDialog: () => dispatch(dialogClose()),
        requestLogin: (username, password) => dispatch(loginThunk({username, password})),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DialogLogin);
