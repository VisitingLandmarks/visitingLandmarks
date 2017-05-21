import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import PropTypes from 'prop-types';

const conditionalRoute = (target, check) => {
    const Condition = ({component, store, ...rest}) => (
        <Route {...rest} render={(props) => {
            return (
                check(store) ? (
                    React.createElement(component, props)
                ) : (
                    <Redirect to={{
                        pathname: target,
                        state: {from: props.location}, // eslint-disable-line react/prop-types
                    }} />
                )
            );
        }} />
    );
    Condition.propTypes = {
        component: PropTypes.func.isRequired,
        store: PropTypes.object.isRequired,
    };

    return Condition;
};

export default conditionalRoute;
