import React, { PropTypes } from 'react';

export default class Login extends React.Component {
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

    handleSubmit(e) {
        e.preventDefault();
        var username = this.state.username.trim();
        var password = this.state.password.trim();
        if (!username || !password) {
            return;
        }
        this.props.handleLoginSubmit({username: username, password: password});
    }

    render() {
        return (
            <form method="post" onSubmit={this.handleSubmit}>
                <div>
                    {this.props.failedLogin ? <label>FAILED</label> : ''}
                    <label>Username:</label>
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
                <div>
                    <input type="submit" value="Log In"/>
                </div>
            </form>);
    }
}