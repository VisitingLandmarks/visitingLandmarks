import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';

import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

import {conversionLocationVisitHide, navigateTo} from '../../redux/action/ui';
import {routes} from '../../modules/routes';

class DialogConversionLocationVisit extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {formatMessage} = this.props.intl;

        const actions = [
            <RaisedButton
                label={formatMessage({id: 'dialog.close'})}
                primary={false}
                onTouchTap={this.props.onCloseDialog}
            />,
            <RaisedButton
                label={formatMessage({id: 'dialog.conversionLocationVisit.register'})}
                primary={true}
                onTouchTap={this.props.onOpenRegister}
            />,
            <RaisedButton
                label={formatMessage({id: 'dialog.conversionLocationVisit.login'})}
                primary={true}
                onTouchTap={this.props.onOpenLogin}
            />,

        ];

        return (<Dialog
            title={formatMessage({id: 'dialog.conversionLocationVisit.title'})}
            actions={actions}
            open={!!this.props.location}
        >
            <div>
                <FormattedMessage id="dialog.conversionLocationVisit.content" />
            </div>
        </Dialog>);
    }

}

DialogConversionLocationVisit.propTypes = {
    intl: intlShape.isRequired,
    location: PropTypes.object,

    onOpenLogin: PropTypes.func.isRequired,
    onOpenRegister: PropTypes.func.isRequired,
    onCloseDialog: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
    return {
        location: state.control.conversionLocationVisit && state.data.locations[state.control.conversionLocationVisit] || undefined,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onOpenLogin: () => dispatch(navigateTo(routes.user.login)),
        onOpenRegister: () => dispatch(navigateTo(routes.user.register)),
        onCloseDialog: () => dispatch(conversionLocationVisitHide()),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(injectIntl(DialogConversionLocationVisit));
