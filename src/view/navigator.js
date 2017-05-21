import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

/**
 * this class handles the navigation through the page via react-router.
 * Much simpler and easier to use than https://github.com/ReactTraining/react-router/tree/master/packages/react-router-redux
 */
class Navigator extends React.Component {

    componentDidUpdate () {
        if (this.props.navigateTo.target) {
            this.context.router.history.push(this.props.navigateTo.target);
        }
    }

    render () {
        return null;
    }
}

Navigator.propTypes = {
    navigateTo: PropTypes.object.isRequired,
};

Navigator.contextTypes = {
    router: PropTypes.object,
};

const mapStateToProps = (state) => {
    return {
        navigateTo: state.control.navigateTo,
    };
};

const mapDispatchToProps = () => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Navigator);
