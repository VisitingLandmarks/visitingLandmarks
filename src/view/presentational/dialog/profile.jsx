import React, {PropTypes} from 'react';

import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

export const dialogName = 'PROFILE';

const formatVisitedLocations = (locations, visitedLocations) => {

    return Object.keys(visitedLocations)
        .map((key)=> {
            return {
                ...locations[key],
                dateTimeOfVisit: new Date(visitedLocations[key])
            };

        })
        .sort((a, b)=> {
            return a.dateTimeOfVisit - b.dateTimeOfVisit;
        })
        .map((element) => {
            return <li key={element.originalUrl}>{element.dateTimeOfVisit.toString()} : {element.originalUrl}</li>;
        });
};

const formatCategories = (categories, visitedLocations) => {

    return Object.keys(categories)
        .map((key)=> {
            return {
                name: categories[key].name,
                visited: countVisitedLocationsInCategory(categories[key].items, visitedLocations),
                total: categories[key].items.length
            };
        })
        .map((element) => {
            return <li key={element.name}>{element.name} ({element.visited} / {element.total})</li>;
        });

};

const countVisitedLocationsInCategory = (categoryItems, visitedLocations) => {

    return categoryItems.reduce((count, id)=> {
        if (visitedLocations[id]) {
            count++;
        }
        return count;
    }, 0);

}

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

        const formatedVisitedLocations = formatVisitedLocations(this.props.locations, this.props.visitedLocations);
        const formatedCategories = formatCategories(this.props.categories, this.props.visitedLocations);
        
        return (
            <Dialog
                title="Login"
                actions={actions}
                open={this.props.open}
            >
                <div>
                    <label>Visited Locations:</label>
                    <ul>{formatedVisitedLocations}</ul>
                </div>
                <div>
                    <label>Categories:</label>
                    <ul>{formatedCategories}</ul>
                </div>
            </Dialog>
        );
    }
}