/**
 * blocked requests if user is not logged in
 * aka user property not set
 */
export default module.exports = (req, res, next)=> {
    if (!req.user) {
        res.status(403).send();
        return;
    }

    next();
};