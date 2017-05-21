module.exports = (app) => {
    /**
     * error handling during request
     * display 500 and error id to the user and log error internally
     * removing the next will make the function fail. it is only an error handle if all 4 arguments are defined
     */
    app.use((err, req, res, next) => {
        req.log.error(err);
        res.status(500).send(req.reqId);
    });
};
