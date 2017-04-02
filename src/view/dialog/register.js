import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

import DialogUserPassword from './userPassword';

import {registerThunk} from '../../redux/action/thunk/register';
import {registering} from '../../redux/action/thunk/register';
import {navigateTo} from '../../redux/action/ui';
import {failure, inProgress} from '../../redux/reducer/communication';

import routes from '../../../config/routes';

export const dialogName = 'Register';

class DialogRegister extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <DialogUserPassword
                {...this.props}
                open={true} //@todo: remove
                dialogName={dialogName}
                onSubmit={this.props.requestRegister}
            />
        );
    }

}

DialogRegister.propTypes = {
    disabled: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired,

    onCloseDialog: PropTypes.func.isRequired,
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
        onCloseDialog: () => dispatch(navigateTo(routes.root)),
        requestRegister: (username, password) => dispatch(registerThunk({username, password})),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DialogRegister);