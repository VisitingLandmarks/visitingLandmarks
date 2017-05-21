import * as data from '../data';

export const send403 = (res) => res.status(403).send();

/**
 * restrict the access to a route
 * @param req
 * @param res
 * @param next
 */
export const restrictLoggedInUser = (req, res, next) => {
    if (!req.user) {
        send403(res);
        return;
    }

    next();
};

/**
 * restrict the access to a route
 * @param req
 * @param res
 * @param next
 */
export const restrictAdminUser = (req, res, next) => {
    if (!req.user) {
        send403(res);
        return;
    }
    data.user.isAdmin(req.user)
        .then((isAdmin) => {
            if (!isAdmin) {
                send403(res);
                return;
            }
            next();
        });
};
