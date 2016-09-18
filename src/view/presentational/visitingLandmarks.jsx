import React from 'react';
import LoginArea from './loginArea.jsx';
import Radium from 'radium';

class VisitingLandmarks extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <LoginArea {...this.props}/>
            </div>
        )
    }
}

export default Radium(VisitingLandmarks);