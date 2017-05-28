import React from 'react';
import PropTypes from 'prop-types';

/**
 * a generic data getter able to decide when to get data
 * taking into account the existence of the data and the current communication state
 * @todo: extend this to handle conditional rendering based on multiple data sources -> parallel getting
 */
export default class DataGetter extends React.Component {

    componentDidMount () {
        // if the communication is is undefined, not "inProgress, success or failed" get data
        // and do this just if you are a browser. ServerSideRendering is async -> optimize SSR by dispatching data before rendering
        if (!this.props.state && !this.props.data) {
            this.props.getter();
        }
    }

    render () {
        debugger;
        // if the data is already there, we can render the wrapped component
        return this.props.data !== undefined && this.props.children || null;
    }

}

DataGetter.propTypes = {
    children: PropTypes.element.isRequired,
    data: PropTypes.any,
    getter: PropTypes.func.isRequired,
    state: PropTypes.any,
};
