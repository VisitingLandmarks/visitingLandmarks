// require('../../../testDOM.js')();
// let unexpected = require('unexpected');
//
// // then require unexpected-react
// let unexpectedReact = require('unexpected-react');
//
// // then react
// let React = require('react');
//
// // ...and optionally the addons
// let TestUtils = require('react-addons-test-utils');
// import LanguageSelect from '../../../../src/view/menu/languageSelect';
//
// import {IntlProvider} from 'react-intl-redux';
// import {Provider} from 'react-redux';
//
// import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import getMuiTheme from 'material-ui/styles/getMuiTheme';
// import injectTapEventPlugin from 'react-tap-event-plugin';
// injectTapEventPlugin();
//
// const expect = unexpected.clone()
//     .use(unexpectedReact);
//
// import {createStore, applyMiddleware} from 'redux';
// import thunk from 'redux-thunk';
// import reducer from '../../../../src/redux/reducer';
//
// const store = createStore(reducer, applyMiddleware(thunk));
//
// describe('LanguageSelect', function () {
//     it('renders a button', function () {
//         const component = TestUtils.renderIntoDocument(
//             <Provider store={store}>
//                 <IntlProvider>
//                     <MuiThemeProvider muiTheme={getMuiTheme({userAgent: 'node.js'}, darkBaseTheme)}>
//                         <LanguageSelect />
//                     </MuiThemeProvider>
//                 </IntlProvider>
//             </Provider>);
//         expect(component, 'to have rendered',
//             <LanguageSelect>
//                 <button>Click me</button>
//             </LanguageSelect>);
//     });
// });
