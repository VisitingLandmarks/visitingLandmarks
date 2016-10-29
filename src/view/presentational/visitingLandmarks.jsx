import React from 'react';
import Radium from 'radium';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import MainMap from './mainMap.jsx';
import MainMenu from './mainMenu.jsx';

import {onVisitLocation} from '../../client/toServer.js';

/**
 * the whole frontend
 */
class VisitingLandmarks extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div className="mainContainer">
                <MainMap
                    followUser={this.props.followUser}
                    visitedLocations={this.props.visitedLocations}
                    locations={this.props.locations}
                    onToggleFollowUser={this.props.onToggleFollowUser}
                    onVisitLocation={onVisitLocation}
                />
                <MainMenu {...this.props}/>
            </div>
        )

    }
}

export default Radium(VisitingLandmarks);