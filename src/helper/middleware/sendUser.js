/**
 * answer a request with the user object
 */
export default module.exports = (req, res)=> {
    res.json({user: req.user});
};