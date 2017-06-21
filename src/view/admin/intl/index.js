import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Presentation from './presentation';
import DataGetter from '../../dataGetter';

import getAdminDataThunk, {gettingAdminData} from '../../../redux/action/thunk/getAdminData';

class AdminIntl extends React.Component {

    render () {
        return (<DataGetter
            getter={this.props.getData}
            state={this.props.state}
            data={this.props.data}
        >
            <Presentation data={this.props.data} />
        </DataGetter>);
    }

}

AdminIntl.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    state: PropTypes.any,

    getData: PropTypes.func.isRequired,

};

const mapStateToProps = (state) => {
    return {
        data: state.data.admin && state.data.admin.intl,
        state: state.communication[gettingAdminData] && state.communication[gettingAdminData].intl,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getData: () => dispatch(getAdminDataThunk('intl')),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AdminIntl);
