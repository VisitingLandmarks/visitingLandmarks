import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {injectIntl, intlShape} from 'react-intl';

import DialogUserPassword from './userPassword';
import Facebook from './facebook';
import Google from './google';

import {registering, registerThunk} from '../../redux/action/thunk/register';
import {navigateTo} from '../../redux/action/ui';
import {failure, inProgress} from '../../redux/reducer/communication';

import {routes} from '../../modules/routes';

class DialogRegister extends React.Component {

    render () {
        return (
            <DialogUserPassword
                {...this.props}
                open
                dialogName={this.props.intl.formatMessage({id: 'dialog.register.title'})}
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

    intl: intlShape.isRequired,
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
)(injectIntl(DialogRegister));
