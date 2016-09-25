import React from 'react';
import Radium from 'radium';

import MainMap from './mainMap.jsx';
import LoginArea from './loginArea.jsx';

import {onVisitLocation} from '../../client/toServer.js';

class VisitingLandmarks extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="mainContainer">
                <MainMap locations={this.props.locations} onVisitLocation={onVisitLocation} />
                <LoginArea {...this.props}/>
            </div>
        )
    }
}

export default Radium(VisitingLandmarks);