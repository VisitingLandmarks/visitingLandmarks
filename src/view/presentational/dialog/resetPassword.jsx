import React, {PropTypes} from 'react';

import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

export const dialogName = 'RESET_PASSWORD';

export default class DialogResetPassword extends React.Component {

    constructor(props) {

        super(props);
        this.state = {
            username: '',
            password: ''
        };

        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleUsernameChange(e) {
        this.setState({username: e.target.value});
    }

    handleSubmit() {

        var username = this.state.username.trim();
        if (!username) {
            return;
        }
        this.props.requestResetPassword(username);
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
            />
        ];

        return (
            <Dialog
                title="Reset Password"
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
                </form>
            </Dialog>
        );
    }
}