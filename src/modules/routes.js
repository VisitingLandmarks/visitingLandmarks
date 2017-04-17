export const builder = (routes, ...data) => {

    return routes.split('/').map((part) => {
        if (part[0] !== ':') {
            return part;
        }

        return data.shift();
    });

};


export const routes = {
    root: '/',
    static: '/static',
    profile: '/profile',
    auth: {
        facebook: {
            entry: '/auth/facebook',
            callback: '/auth/facebook/callback',
        },
        google: {
            entry: '/auth/google',
            callback: '/auth/google/callback',
        },
    },
    preferences: '/preferences',
    user: {
        confirm: '/confirm/:token',
        login: '/login',
        logout: '/logout',
        image: '/image', //@todo: extend with /:user -> requires a username
        resetPassword: '/resetPassword', //@todo: prevent mixing use cases (dialog and API)
        passwordChange: '/passwordChange',  //@todo: prevent mixing use cases (dialog and API)
        passwordResetRequest: '/requestPasswordReset',
        passwordReset: '/resetPassword/:resetPasswordToken',
        register: '/register',
    },
};