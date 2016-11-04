import React from 'react';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import MainMap from './mainMap.jsx';
import MainMenu from './mainMenu.jsx';

import DialogResetPassword from './dialog/resetPassword.jsx';
import DialogLogin from './dialog/login.jsx';
import DialogProfile from './dialog/profile.jsx';
import DialogRegister from './dialog/register.jsx';

import {onVisitLocation} from '../../client/toServer.js';

/**
 * the whole frontend
 */
export default class VisitingLandmarks extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div className="mainContainer">

                <MainMap
                    followUser={this.props.followUser}
                    visitedLocations={this.props.visitedLocations}
                    locations={this.props.locations}
                    onToggleFollowUser={this.props.onToggleFollowUser}
                    onVisitLocation={onVisitLocation}
                />

                <MainMenu
                    followUser={this.props.followUser}
                    loggedIn={this.props.loggedIn}
                    onOpenLoginDialog={this.props.onOpenLoginDialog}
                    onOpenProfileDialog={this.props.onOpenProfileDialog}
                    onOpenRegisterDialog={this.props.onOpenRegisterDialog}
                    onOpenResetPasswordDialog={this.props.onOpenResetPasswordDialog}
                    onToggleFollowUser={this.props.onToggleFollowUser}
                    requestLogout={this.props.requestLogout}
                />
                
                <DialogLogin
                    open={this.props.openDialog.login}
                    onCloseDialog={this.props.onCloseDialog}
                    onSubmit={this.props.requestLogin}
                />
                <DialogProfile
                    open={this.props.openDialog.profile}
                    onCloseDialog={this.props.onCloseDialog}
                    categories={this.props.categories}
                    locations={this.props.locations}
                    visitedLocations={this.props.visitedLocations}
                />
                <DialogRegister
                    open={this.props.openDialog.register}
                    onCloseDialog={this.props.onCloseDialog}
                    onSubmit={this.props.requestRegister}
                />
                <DialogResetPassword
                    open={this.props.openDialog.resetPassword}
                    onCloseDialog={this.props.onCloseDialog}
                    onSubmit={this.props.requestResetPassword}
                />
            </div>
        )

    }
}