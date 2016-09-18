import {connect} from 'react-redux'

import visitingLandmarks from '../presentational/visitingLandmarks.jsx';

import loggedInAction from '../action/loggedIn';
import loggedOutAction from '../action/loggedOut';
import failedLogInAction from '../action/failedLogIn';
import addChallengeAction from '../action/addChallenge';

const mapStateToProps = (state) => {
    return {
        challenges : state.challenges,
        loggedIn: !!state.user,
        username: state.user && state.user.name,
        failedLogin : !!state.failedLogin
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLoggedIn: (user) => dispatch(loggedInAction(user)),
        handleLogout: () => dispatch(loggedOutAction()),
        onFailedLogIn: () => dispatch(failedLogInAction()),
        onChallengeAdded: (challenge) => dispatch(addChallengeAction(challenge))
    }
};


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(visitingLandmarks);