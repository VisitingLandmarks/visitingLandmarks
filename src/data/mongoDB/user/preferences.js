import logger from '../../../modules/logger';

export default module.exports = (userSchema) => {

    //unused
    // userSchema.methods.getPreference = function (key) {
    //     return this.preferences[key];
    // };

    userSchema.methods.setPreference = function (data) {

        Object.keys(data).forEach((key) => {
            this.preferences[key] = data[key];
        });

        this.markModified('preferences');

        return this.save()
            .catch((message) => {
                logger.error({
                    message,
                    data,
                    userId: this._id,
                }, 'mongoDB Error in userSchema.methods.setPreference');
            });
    };

};