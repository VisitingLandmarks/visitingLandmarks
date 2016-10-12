import React, {PropTypes} from 'react';

import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

export default class ChangePasswordLogin extends React.Component {

    constructor(props) {

        super(props);
        this.state = {
            password: ''
        };

        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handlePasswordChange(e) {
        this.setState({password: e.target.value});
    }

    handleSubmit() {
        //@todo: minimum security check
        var password = this.state.password.trim();
        if (!password) {
            return;
        }
        this.props.requestChangePassword(password);
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
                title="Change Password"
                actions={actions}
                modal={true}
                open={this.props.open}
            >
                <form>
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