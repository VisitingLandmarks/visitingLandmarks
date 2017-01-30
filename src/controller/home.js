import * as dataRepository from '../data';
import serverSideView from '../view/serverSide';

export default (req, res) => {

    Promise.all([
        //which data is required for rendering?
        req.user, //the user
        dataRepository.getAllCategories(), //all categories
        dataRepository.getAllLocations(), //all locations
        req.headers['user-agent'],//the user agent,
        res.locals.openDialog,
    ]).then(values => {
        // Send the rendered page back to the client
        res.send(serverSideView(...values));
    }, (err) => {
        res.status(500).send(err);
    });


    // handleMainAppRequests({
    //     user: req.user,
    //     userAgent: res.req.headers['user-agent']
    // }, res);
};

/**
 * fetch all data and render it server-side
 * @param params
 * @param res
 */
// const handleMainAppRequests = (params, res) => {
//
//     Promise.all([
//         //which data is required for rendering?
//         params.user, //the user
//         dataRepository.getAllCategories(), //all categories
//         dataRepository.getAllLocations(), //all locations
//         params.userAgent,//the user agent,
//         params.openDialog
//     ]).then(values => {
//         // Send the rendered page back to the client
//         res.send(serverSideView(...values));
//     }, (err) => {
//         res.status(500).send(err);
//     });
//
// };
