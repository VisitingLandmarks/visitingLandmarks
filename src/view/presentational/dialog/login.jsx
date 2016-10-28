import React, {PropTypes} from 'react';

import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

export const dialogName = 'LOGIN';

export default class DialogLogin extends React.Component {

    constructor(props) {

        super(props);
        this.state = {
            username: '',
            password: ''
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

        var username = this.state.username.trim();
        var password = this.state.password.trim();
        if (!username || !password) {
            return;
        }
        this.props.requestLogin(username, password);
    }

    render() {

        const actions = [
            <RaisedButton
                label="Cancel"
                primary={true}
                onTouchTap={this.props.onCloseDialog}
            />,
            <RaisedButton
                label="Submit"
                primary={true}
                // disabled={true}
                onTouchTap={this.handleSubmit}
            />,
        ];

        return (
            <Dialog
                title="Login"
                actions={actions}
                modal={true}
                open={this.props.open}
            >
                <form>
                    <div>
                        <label>Email:</label>
                        <input type="text"
                               name="username"
                               value={this.state.username}
                               onChange={this.handleUsernameChange}
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input type="password"
                               name="password"
                               value={this.state.password}
                               onChange={this.handlePasswordChange}
                        />
                    </div>
                </form>
            </Dialog>
        );
    }
}