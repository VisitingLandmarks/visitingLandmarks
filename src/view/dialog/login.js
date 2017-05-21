import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {injectIntl, intlShape} from 'react-intl';

import DialogUserPassword from './userPassword';
import Facebook from './facebook';
import Google from './google';

import {loginThunk, loggingIn} from '../../redux/action/thunk/login';
import {navigateTo} from '../../redux/action/ui';
import {failure, inProgress} from '../../redux/reducer/communication';

import {routes} from '../../modules/routes';

class DialogLogin extends React.Component {

    render () {
        return (
            <DialogUserPassword
                {...this.props}
                open
                dialogName={this.props.intl.formatMessage({id: 'dialog.login.title'})}
                onSubmit={this.props.requestLogin}
            >
                <Facebook />
                <Google />
            </DialogUserPassword>
        );
    }

}

DialogLogin.propTypes = {
    requestLogin: PropTypes.func.isRequired,
    onCloseDialog: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
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
)(injectIntl(DialogLogin));
