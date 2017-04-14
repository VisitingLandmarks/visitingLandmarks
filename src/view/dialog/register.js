import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import DialogUserPassword from './userPassword';
import Facebook from './facebook';
import Google from './google';

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
            >
                <Facebook />
                <Google />
            </DialogUserPassword>
        );
    }

}

DialogRegister.propTypes = {
    onCloseDialog: PropTypes.func.isRequired,
    requestRegister: PropTypes.func.isRequired,
};
DialogRegister.contextTypes = {
    router: PropTypes.object,
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