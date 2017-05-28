import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from '../redux/reducer';

export default (req, res, actions, serverSideView) => {
    const store = createStore(reducer, applyMiddleware(thunk));

    actions.forEach((action) => store.dispatch(action));

    // server side rendering
    const {status, url, html} = serverSideView(store, req.url, req.headers['user-agent']);

    // and translate the result to express
    switch (status) {

        case 200: {
            res.send(html);
            return;
        }

        case 301:
        case 302: {
            res.redirect(status, url);
            return;
        }

        default: {
            throw new Error('unimplemented status code in server side rendering');
        }
    }
};
