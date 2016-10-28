require('../../testDOM.js')();
import deepFreeze from 'deep-freeze';

import React from 'react';
import ReactDOM from 'react-dom';

//Material UI
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import MainMenu from '../../../src/view/presentational/mainMenu.jsx';


describe('MainMenu', ()=> {

    beforeEach(()=> {
        global.document.body.innerHTML = '<div id ="testContainer"></div>';
    });

    const defaultProps = deepFreeze({
        openDialog: {
            changePassword : false,
            login : false,
            profile : false,
            register : false
        },
        visitedLocations : {}
    });


    describe('fixed elements', ()=> {

        it('"Follow Me"', ()=> {
            ReactDOM.render(
                <MuiThemeProvider muiTheme={getMuiTheme({userAgent: navigator.userAgent}, darkBaseTheme)}>
                    <MainMenu {...defaultProps} />
                </MuiThemeProvider>, document.getElementById('testContainer'));

            assert.include(global.document.getElementById('testContainer').innerHTML, 'Follow me');
        });

    });

    it('logged out elements', ()=> {

        ReactDOM.render(
            <MuiThemeProvider muiTheme={getMuiTheme({userAgent: navigator.userAgent}, darkBaseTheme)}>
                <MainMenu {...defaultProps} />
            </MuiThemeProvider>, document.getElementById('testContainer'));

        assert.include(global.document.getElementById('testContainer').innerHTML, 'Register');
        assert.include(global.document.getElementById('testContainer').innerHTML, 'Login');
        assert.include(global.document.getElementById('testContainer').innerHTML, 'Forgot Password?');

    });

    it('logged in elements', ()=> {

        const props = {
            ...defaultProps,
            userEmail : 'testy@macTesty.com',
            loggedIn : true
        };

        ReactDOM.render(
            <MuiThemeProvider muiTheme={getMuiTheme({userAgent: navigator.userAgent}, darkBaseTheme)}>
                <MainMenu {...props} />
            </MuiThemeProvider>, document.getElementById('testContainer'));

        assert.include(global.document.getElementById('testContainer').innerHTML, 'Logout');
        assert.include(global.document.getElementById('testContainer').innerHTML, 'testy@macTesty.com');

    });

});