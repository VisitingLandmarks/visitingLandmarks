require('../../testDOM.js')();

import LoggedIn from '../../../src/view/presentational/loggedIn.jsx';
import React from 'react';
import ReactDOM from 'react-dom';
console.log(LoggedIn);

describe('loggedIn.jsx', ()=> {

    return;
    beforeEach(()=> {
        global.document.body.innerHTML = '<div id ="testContainer"></div>';
    });

    it('includes username', ()=> {
        ReactDOM.render(
            <LoggedIn username="TESTUSERNAME"/>
            , document.getElementById('testContainer'));

            assert.include(global.document.getElementById('testContainer').innerHTML, 'TESTUSERNAME');
    });
});