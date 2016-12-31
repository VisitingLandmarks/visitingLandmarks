import React, {PropTypes} from 'react';

import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import DoneIcon from 'material-ui/svg-icons/action/done';

import getSortScore from '../../../helper/getCategorySortScore';
import countVisitedLocationsInCategory from '../../../helper/countVisitedLocationsInCategory';

export const dialogName = 'Profile';


/**
 * format the visited locations for the profile
 * @param locations
 * @param visitedLocations
 * @returns {Array}
 */
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


/**
 * format the categories for the profile
 * @param categories
 * @param visitedLocations
 * @returns {Array}
 */
const formatCategories = (categories, visitedLocations) => {

    return Object.keys(categories)
        .map((key)=> {
            return {
                name: categories[key].name,
                visited: countVisitedLocationsInCategory(categories[key].items, visitedLocations),
                total: categories[key].items.length
            };
        })
        .sort((a, b)=> {
            return getSortScore(a) - getSortScore(b);
        })
        .map((element) => {
            const done = (element.total === element.visited ? <DoneIcon /> : null);
            return <li key={element.name}>{element.name} ({element.visited} / {element.total}){done}</li>;
        });

};


/**
 * the profile dialog
 */
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
                title={dialogName}
                actions={actions}
                open={this.props.open}
            >
                <div>
                    <label>Confirmed: </label>{this.props.userEmailConfirmed ? <DoneIcon /> : null}
                </div>
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