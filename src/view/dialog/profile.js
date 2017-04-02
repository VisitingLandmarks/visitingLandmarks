import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import DoneIcon from 'material-ui/svg-icons/action/done';

import getSortScore from '../../modules/getCategorySortScore';
import countVisitedLocationsInCategory from '../../modules/countVisitedLocationsInCategory';

export const dialogName = 'Profile';


/**
 * format the visited locations for the profile
 * @param locations
 * @param visitedLocations
 * @returns {Array}
 */
const formatVisitedLocations = (locations, visitedLocations) => {

    return Object.keys(visitedLocations)
        .map((key) => {
            return {
                ...locations[key],
                id: key,
                dateTimeOfVisit: new Date(visitedLocations[key]),
            };

        })
        .sort((a, b) => {
            return a.dateTimeOfVisit - b.dateTimeOfVisit;
        })
        .map((element) => {
            return <li key={element.id}>{element.dateTimeOfVisit.toString()}
                : {element.name} {element.originalUrl}</li>;
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
        .map((key) => {
            return {
                name: categories[key].name,
                visited: countVisitedLocationsInCategory(categories[key].items, visitedLocations),
                total: categories[key].items.length,
            };
        })
        .sort((a, b) => {
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
class DialogProfile extends React.Component {

    constructor(props) {
        super(props);
        this.onCloseDialog = this.onCloseDialog.bind(this);
    }

    onCloseDialog() {
        this.context.router.history.push('/');
    }

    render() {

        const actions = [
            <RaisedButton
                label="Close"
                primary={true}
                onTouchTap={this.onCloseDialog}
            />,
        ];

        const formatedVisitedLocations = formatVisitedLocations(this.props.locations, this.props.visitedLocations);
        const formatedCategories = formatCategories(this.props.categories, this.props.visitedLocations);

        return (
            <Dialog
                title={dialogName}
                actions={actions}
                open={true}
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

DialogProfile.propTypes = {
    userEmailConfirmed: PropTypes.bool.isRequired,
    locations: PropTypes.object.isRequired,
    categories: PropTypes.object.isRequired,
    visitedLocations: PropTypes.object.isRequired,
};

DialogProfile.contextTypes = {
    router: React.PropTypes.object,
};


const mapStateToProps = (state) => {
    return {
        categories: state.data.categories,
        locations: state.data.locations,
        userEmailConfirmed: state.session.user && state.session.user.isConfirmed || false,
        visitedLocations: state.session.user && state.session.user.visited || {},
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DialogProfile);
