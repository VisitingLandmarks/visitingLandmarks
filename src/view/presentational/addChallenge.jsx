import React  from 'react';
import Radium from 'radium';

const styles = {
    base : {
        'font-size' : '14px'
    },
    ready : {
        color : 'green'
    }
};


export default Radium((props) => {
    return (
        <li><a onClick={props.addChallenge}>Add Challenge</a></li>
    );
});
