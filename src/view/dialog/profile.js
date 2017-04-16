import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {injectIntl, intlShape, FormattedDate, FormattedMessage} from 'react-intl';

import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import DoneIcon from 'material-ui/svg-icons/action/done';

import getSortScore from '../../modules/getCategorySortScore';
import countVisitedLocationsInCategory from '../../modules/countVisitedLocationsInCategory';

import {routes} from '../../modules/routes';

import {navigateTo} from '../../redux/action/ui';


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
            return <li key={element.id}>
                <FormattedDate value={element.dateTimeOfVisit}/> : {element.name} {element.originalUrl}
            </li>;
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
    }


    render() {
        const {formatMessage} = this.props.intl;
        const actions = [
            <RaisedButton
                label={formatMessage({id: 'dialog.profile.changePassword'})}
                primary={false}
                onTouchTap={this.props.onChangePasswordDialog}
            />,
            <RaisedButton
                label={formatMessage({id: 'dialog.close'})}
                primary={true}
                onTouchTap={this.props.onCloseDialog}
            />,

        ];

        const formatedVisitedLocations = formatVisitedLocations(this.props.locations, this.props.visitedLocations);
        const formatedCategories = formatCategories(this.props.categories, this.props.visitedLocations);

        return (
            <Dialog
                title={formatMessage({id: 'dialog.profile.title'}, {userEmail: this.props.userEmail})}
                actions={actions}
                open={true}
            >
                <div>
                    <label><FormattedMessage id="dialog.profile.confirmed"/>: </label>{this.props.userEmailConfirmed ? <DoneIcon /> : null}
                </div>
                <div>
                    <label><FormattedMessage id="dialog.profile.visitedLocations"/>:</label>
                    <ul>{formatedVisitedLocations}</ul>
                </div>
                <div>
                    <label><FormattedMessage id="dialog.profile.categories"/>:</label>
                    <ul>{formatedCategories}</ul>
                </div>
            </Dialog>
        );
    }
}

DialogProfile.propTypes = {
    userEmail: PropTypes.string.isRequired,
    userEmailConfirmed: PropTypes.bool.isRequired,
    locations: PropTypes.object.isRequired,
    categories: PropTypes.object.isRequired,
    visitedLocations: PropTypes.object.isRequired,

    onCloseDialog: PropTypes.func.isRequired,
    onChangePasswordDialog: PropTypes.func.isRequired,

    intl: intlShape.isRequired,
};


const mapStateToProps = (state) => {
    return {
        categories: state.data.categories,
        locations: state.data.locations,
        userEmail: state.session.user.email,
        userEmailConfirmed: state.session.user && state.session.user.isConfirmed || false,
        visitedLocations: state.session.user && state.session.user.visited || {},
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onChangePasswordDialog: () => dispatch(navigateTo(routes.user.passwordChange)),
        onCloseDialog: () => dispatch(navigateTo(routes.root)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(injectIntl(DialogProfile));
