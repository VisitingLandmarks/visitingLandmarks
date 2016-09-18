import React from 'react';
import LoginArea from './loginArea.jsx';
import Challenges from './challenges.jsx';
import Radium from 'radium';

class visitingLandmarks extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <LoginArea {...this.props}/>
               <Challenges onChallengeAdded={this.props.onChallengeAdded} challenges={this.props.challenges}/>
            </div>
        )
    }
}

export default Radium(visitingLandmarks);