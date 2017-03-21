import React, {PropTypes} from 'react';

import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const buttonStyle = {
    margin: 12,
};

const dialogStyle = {
    width: '100%',
    maxWidth: '400px',
};


/**
 * a generic dialog for username and password fields
 */
export default class DialogUserPassword extends React.Component {

    constructor(props) {

        super(props);
        this.state = {
            username: '',
            password: '',
        };

        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleUsernameChange(e) {
        this.setState({username: e.target.value});
    }

    handlePasswordChange(e) {
        this.setState({password: e.target.value});
    }

    handleSubmit() {

        const username = this.state.username.trim();
        const password = this.state.password.trim();
        if (!username || !password) {
            return;
        }
        this.props.onSubmit(username, password);

    }

    render() {


        const actions = [
            <RaisedButton
                style={buttonStyle}
                label="Cancel"
                primary={true}
                onTouchTap={this.props.onCloseDialog}
                disabled={this.props.disabled}
            />,
            <RaisedButton
                style={buttonStyle}
                label="Submit"
                primary={true}
                onTouchTap={this.handleSubmit}
                disabled={this.props.disabled}
            />,
        ];


        const usernameLine = <tr>
            <td>
                <label>Email:</label>
            </td>
            <td>
                <TextField type="text"
                           name="username"
                           value={this.state.username}
                           onChange={this.handleUsernameChange}
                />
            </td>
        </tr>;

        const passwordLine = <tr>
            <td>
                <label>Password:</label>
            </td>
            <td>
                <TextField type="password"
                           name="password"
                           value={this.state.password}
                           onChange={this.handlePasswordChange}
                           errorText={this.props.error}
                />
            </td>
        </tr>;

        return (
            <Dialog
                contentStyle={dialogStyle}
                title={this.props.dialogName}
                actions={actions}
                modal={true}
                open={this.props.open}
            >
                <form>
                    <table>
                        <tbody>
                        {(this.props.showUsernameLine ? usernameLine : null)}
                        {(this.props.showPasswordLine ? passwordLine : null)}
                        </tbody>
                    </table>
                </form>
            </Dialog>
        );

    }
}


DialogUserPassword.propTypes = {
    dialogName: PropTypes.string.isRequired,
    disabled: PropTypes.boolean.isRequired,
    error: PropTypes.string,
    onCloseDialog: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    showUsernameLine: PropTypes.bool.isRequired,
    showPasswordLine: PropTypes.bool.isRequired,
};

DialogUserPassword.defaultProps = {
    showUsernameLine: true,
    showPasswordLine: true,
};