import React from 'react';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import MainMap from './mainMap';
import MainMenu from './mainMenu';

import DialogResetPassword from './dialog/resetPassword';
import DialogLogin from './dialog/login';
import DialogProfile from './dialog/profile';
import DialogRegister from './dialog/register';

import {onVisitLocation} from '../../client/toServer';

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
                    userEmailConfirmed={this.props.userEmailConfirmed}
                />
                <DialogRegister
                    open={this.props.openDialog.register}
                    onCloseDialog={this.props.onCloseDialog}
                    onSubmit={this.props.requestRegister}
                />
                <DialogResetPassword
                    open={this.props.openDialog.passwordReset}
                    onCloseDialog={this.props.onCloseDialog}
                    onSubmit={this.props.requestResetPassword}
                />
            </div>
        )

    }
}