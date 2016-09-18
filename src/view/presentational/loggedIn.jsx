import React, {PropTypes}  from 'react';

class LoggedIn extends React.Component {

    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        $.post('/logout').done(this.props.handleLogout);

    }

    render() {
        return (
            <div>loggedIn as {this.props.username} <a onClick={this.handleSubmit}>Logout!!</a></div>
        );
    }
}


export default LoggedIn;
