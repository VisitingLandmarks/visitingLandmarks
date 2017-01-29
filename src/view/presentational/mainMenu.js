import React from 'react';

import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import Toggle from 'material-ui/Toggle';


const menuStyle = {
    display: 'inline-block',
    padding: 0
};

const menuListStyle = {
    paddingBottom: 0,
    paddingTop: 0
};

const toggleLabelStyle = {
    marginLeft: 16,
    lineHeight: '48px'
};

const toggleIconStyle = {
    marginRight: 16,
    marginTop: 12
};


/**
 * MainMenu
 */
export default class MainMenu extends React.Component {

    constructor(props) {

        super(props);

        this.onToggleFollowUser = this.onToggleFollowUser.bind(this);

    }


    /**
     * handle a user switch in the follow user menu item
     * @param event
     * @param value
     * @returns {*}
     */
    onToggleFollowUser(event, value) {
        return this.props.onToggleFollowUser(value);
    }

    render() {

        let menuItems;

        if (this.props.loggedIn) {
            menuItems = [
                <MenuItem key="userEmail" primaryText="Profile" onTouchTap={this.props.onOpenProfileDialog}/>,
                <Divider key="userEmailDivider"/>,
                <MenuItem key="logout" primaryText="Logout" onTouchTap={this.props.requestLogout}/>
            ];
        } else {
            menuItems = [
                <MenuItem key="register" primaryText="Register" onTouchTap={this.props.onOpenRegisterDialog}/>,
                <MenuItem key="login" primaryText="Login" onTouchTap={this.props.onOpenLoginDialog}/>,
                <MenuItem key="resetPassword" primaryText="Forgot Password?" onTouchTap={this.props.onOpenResetPasswordDialog}/>
            ];
        }

        return (
            <div className="MainMenu">
                <Paper>
                    <Menu style={menuStyle} listStyle={menuListStyle}>
                        {menuItems}
                        <Divider />
                    </Menu>
                    <Toggle label="Follow me" onToggle={this.onToggleFollowUser} defaultToggled={this.props.followUser} labelStyle={toggleLabelStyle} iconStyle={toggleIconStyle}/>
                </Paper>

            </div>
        )

    }
}
