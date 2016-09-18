import React from 'react';
import LoggedIn from './loggedIn.jsx';
import Login from './login.jsx';

export default class LoginArea extends React.Component {
    constructor(props) {
        super(props);
        this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    }

    handleLoginSubmit(loginData) {
        var component = this;
        $.post('/login', loginData)
            .done((data) => {
                component.props.onLoggedIn(data.user);
            })
            .fail(component.props.onFailedLogIn);
    }

    render() {
        return (
            <div className="LoginArea">

                {
                    this.props.loggedIn ?
                    <LoggedIn username={this.props.username} handleLogout={this.props.handleLogout}/> :
                    <Login handleLoginSubmit={this.handleLoginSubmit} failedLogin={this.props.failedLogin}/>
                }
            </div>
        )
    }
}
