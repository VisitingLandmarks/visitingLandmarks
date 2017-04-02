import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

import DialogUserPassword from './userPassword';

import {registerThunk} from '../../redux/action/thunk/register';
import {registering} from '../../redux/action/thunk/register';
import {failure, inProgress} from '../../redux/reducer/communication';

export const dialogName = 'Register';

class DialogRegister extends React.Component {

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
                onSubmit={this.props.requestRegister}
            />
        );
    }

}

DialogRegister.propTypes = {
    requestRegister: PropTypes.func.isRequired,
};
DialogRegister.contextTypes = {
    router: React.PropTypes.object,
};

const mapStateToProps = (state) => {
    return {
        disabled: state.communication[registering][inProgress],
        error: state.communication[registering][failure],
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        // onCloseDialog: () => dispatch(dialogClose()),
        requestRegister: (username, password) => dispatch(registerThunk({username, password})),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DialogRegister);