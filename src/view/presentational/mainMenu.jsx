import React from 'react';

import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';

import DialogLogin from './dialog/login.jsx';
import DialogRegister from './dialog/register.jsx';
import DialogChangePassword from './dialog/changePassword.jsx';
import Toggle from 'material-ui/Toggle';


const menuStyle = {
    display: 'inline-block'
};

const toggleStyle = {
    marginBottom: 16
};


/**
 * MainMenu
 */
export default class MainMenu extends React.Component {

    constructor(props) {

        super(props);

        this.onToggleFollowUser = this.onToggleFollowUser.bind(this);

    }

    onToggleFollowUser(event, value) {
        return this.props.onToggleFollowUser(value);
    }

    render() {

        let menuItems;
        if (this.props.loggedIn) {
            menuItems = [
                <MenuItem key="userEmail" primaryText={this.props.userEmail}/>,
                <Divider key="userEmailDivider"/>,
                <MenuItem key="logout" primaryText="Logout" onTouchTap={this.props.requestLogout}/>
            ];
        } else {
            menuItems = [
                <MenuItem key="register" primaryText="Register" onTouchTap={this.props.onOpenRegisterDialog}/>,
                <MenuItem key="login" primaryText="Login" onTouchTap={this.props.onOpenLoginDialog}/>,
                <MenuItem key="resetPassword" primaryText="Forgot Password?"/>
            ];
        }

        return (
            <div className="MainMenu">
                <Paper>
                    <Menu style={menuStyle}>
                        {menuItems}
                    </Menu>
                    <Toggle label="Follow me" onToggle={this.onToggleFollowUser} defaultToggled={this.props.followUser} style={toggleStyle}/>
                </Paper>
                <DialogLogin open={this.props.openDialog.login} onCloseDialog={this.props.onCloseDialog} requestLogin={this.props.requestLogin}/>
                <DialogRegister open={this.props.openDialog.register} onCloseDialog={this.props.onCloseDialog} requestRegister={this.props.requestRegister}/>
                <DialogChangePassword open={this.props.openDialog.changePassword} onCloseDialog={this.props.onCloseDialog} requestChangePassword={this.props.requestChangePassword}/>
            </div>
        )

    }
}
