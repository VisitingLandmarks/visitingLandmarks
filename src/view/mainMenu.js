import React from 'react';
import PropTypes from 'prop-types';

import {injectIntl, intlShape} from 'react-intl';

import LanguageSelect from './menu/languageSelect';

import Divider from 'material-ui/Divider';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';


const menuStyle = {
    position: 'fixed',
    top: '3%',
    right: '3%',
    zIndex: 50000,
};


/**
 * MainMenu
 */
class MainMenu extends React.Component {

    constructor(props) {

        super(props);

        this.onToggleFollowUser = this.onToggleFollowUser.bind(this);
        this.handleTouchTap = this.handleTouchTap.bind(this);
        this.handleRequestClose = this.handleRequestClose.bind(this);

        this.state = {open: false};

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

    handleTouchTap(event) {
        // This prevents ghost click.
        event.preventDefault();

        this.setState({
            open: !this.state.open,
            anchorEl: event.currentTarget,
        });
    }

    handleRequestClose() {
        this.setState({
            open: false,
        });
    }


    render() {

        let menuItems;
        const {formatMessage} = this.props.intl;

        if (this.props.loggedIn) {

            menuItems = [
                <MenuItem key="userEmail" primaryText={formatMessage({id: 'menu.profile'})}
                          onTouchTap={this.props.onOpenProfileDialog}/>,
                <Divider key="userEmailDivider"/>,
                <MenuItem key="logout" primaryText={formatMessage({id: 'menu.logout'})}
                          onTouchTap={this.props.requestLogout}/>,
            ];

        } else {

            menuItems = [
                <MenuItem key="register" primaryText={formatMessage({id: 'menu.register'})}
                          onTouchTap={this.props.onOpenRegisterDialog}/>,
                <MenuItem key="login" primaryText={formatMessage({id: 'menu.login'})}
                          onTouchTap={this.props.onOpenLoginDialog}/>,
                <MenuItem key="resetPassword" primaryText={formatMessage({id: 'menu.resetPassword'})}
                          onTouchTap={this.props.onOpenResetPasswordDialog}/>,
            ];

        }

        return (
            <div style={menuStyle}>
                <RaisedButton
                    onTouchTap={this.handleTouchTap}
                    label={formatMessage({id: 'menu.title'})}
                />
                <Popover
                    open={this.state.open}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                    targetOrigin={{horizontal: 'right', vertical: 'top'}}
                    onRequestClose={this.handleRequestClose}
                >
                    <Menu>
                        <LanguageSelect />
                        {menuItems}
                        <Divider />
                        <MenuItem>
                            <Toggle
                                label={formatMessage({id: 'menu.follow'})}
                                onToggle={this.onToggleFollowUser}
                                defaultToggled={this.props.followUser}
                            />
                        </MenuItem>
                    </Menu>
                </Popover>

            </div>
        );

    }
}

MainMenu.propTypes = {
    followUser: PropTypes.bool.isRequired,
    onOpenLoginDialog: PropTypes.func.isRequired,
    onOpenProfileDialog: PropTypes.func.isRequired,
    onOpenRegisterDialog: PropTypes.func.isRequired,
    onOpenResetPasswordDialog: PropTypes.func.isRequired,
    onToggleFollowUser: PropTypes.func.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    requestLogout: PropTypes.func.isRequired,

    intl: intlShape.isRequired,
};

export default injectIntl(MainMenu);