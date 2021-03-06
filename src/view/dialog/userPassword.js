import React from 'react';
import PropTypes from 'prop-types';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';

import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const style = {
    button: {
        margin: 12,
    },
    dialog: {
        width: '100%',
        maxWidth: '400px',
    },
    form: {
        marginBottom: 10,
    },
};

/**
 * a generic dialog for username and password fields
 */
class DialogUserPassword extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            username: '',
            password: '',
        };

        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleUsernameChange (e) {
        this.setState({username: e.target.value});
    }

    handlePasswordChange (e) {
        this.setState({password: e.target.value});
    }

    handleSubmit () {
        const username = this.state.username.trim();
        const password = this.state.password.trim();
        if (this.props.showUsernameLine && !username || this.props.showPasswordLine && !password) {
            return;
        }
        this.props.onSubmit(username, password);
    }

    render () {
        const {formatMessage} = this.props.intl;

        const actions = [
            <RaisedButton
                style={style.button}
                label={formatMessage({id: 'dialog.cancel'})}
                primary={false}
                onTouchTap={this.props.onCloseDialog}
                disabled={this.props.disabled}
            />,
            <RaisedButton
                style={style.button}
                label={formatMessage({id: 'dialog.submit'})}
                primary
                onTouchTap={this.handleSubmit}
                disabled={this.props.disabled}
            />,
        ];

        const usernameLine = <tr>
            <td>
                <label><FormattedMessage id='dialog.userPassword.email' />:</label>
            </td>
            <td>
                <TextField type='text'
                    name='username'
                    value={this.state.username}
                    onChange={this.handleUsernameChange}
                />
            </td>
        </tr>;

        const passwordLine = <tr>
            <td>
                <label><FormattedMessage id='dialog.userPassword.password' />:</label>
            </td>
            <td>
                <TextField type='password'
                    name='password'
                    value={this.state.password}
                    onChange={this.handlePasswordChange}
                    errorText={this.props.error}
                />
            </td>
        </tr>;

        return (
            <Dialog
                contentStyle={style.dialog}
                title={this.props.dialogName}
                actions={actions}
                modal
                open={this.props.open}
            >
                <form style={style.form}>
                    <table>
                        <tbody>
                            {(this.props.showUsernameLine ? usernameLine : null)}
                            {(this.props.showPasswordLine ? passwordLine : null)}
                        </tbody>
                    </table>
                </form>
                {this.props.children}
            </Dialog>
        );
    }
}

DialogUserPassword.propTypes = {
    children: PropTypes.array,
    dialogName: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    error: PropTypes.string,
    onCloseDialog: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    showUsernameLine: PropTypes.bool.isRequired,
    showPasswordLine: PropTypes.bool.isRequired,

    intl: intlShape.isRequired,
};

DialogUserPassword.defaultProps = {
    showUsernameLine: true,
    showPasswordLine: true,
};

export default injectIntl(DialogUserPassword);
