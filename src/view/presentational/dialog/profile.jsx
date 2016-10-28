import React, {PropTypes} from 'react';

import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

export const dialogName = 'PROFILE';

export default class DialogProfile extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        const actions = [
            <RaisedButton
                label="Close"
                primary={true}
                onTouchTap={this.props.onCloseDialog}
            />
        ];

        const visitedLocations = Object.keys(this.props.visitedLocations).map((key)=>{
            const dateOfVisit = this.props.visitedLocations[key];
            return <li key={key}>{dateOfVisit} : {key}</li>;
            
        });

        return (
            <Dialog
                title="Login"
                actions={actions}
                open={this.props.open}
            >
                <div>
                    <label>Visited Locations:</label>
                    <ul>{visitedLocations}</ul>
                </div>
            </Dialog>
        );
    }
}