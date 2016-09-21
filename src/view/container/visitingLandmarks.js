import {connect} from 'react-redux';

import VisitingLandmarks from '../presentational/visitingLandmarks.jsx';

import loggedInAction from '../action/loggedIn';
import loggedOutAction from '../action/loggedOut';
import failedLogInAction from '../action/failedLogIn';

const mapStateToProps = (state) => {
    return {
        loggedIn: !!state.user,
        username: state.user && state.user.name,
        failedLogin : !!state.failedLogin,
        locations : state.locations
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLoggedIn: (user) => dispatch(loggedInAction(user)),
        handleLogout: () => dispatch(loggedOutAction()),
        onFailedLogIn: () => dispatch(failedLogInAction())
    };
};


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VisitingLandmarks);