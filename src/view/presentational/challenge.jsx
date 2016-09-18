import React  from 'react';
import Radium from 'radium';

const styles = {
    base : {
        'fontSize' : '14px'
    },
    ready : {
        color : 'green'
    }
};


export default Radium((props) => {
    return (
        <li style={[styles.base, styles[props.state]]}>{props.state}</li>
    );
});
