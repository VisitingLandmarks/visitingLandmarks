export const builder = (routes, ...data) => {
    const urlSeperator = '/';

    return routes.split(urlSeperator).map((part) => {
        if (part[0] !== ':') {
            return part;
        }

        return data.shift();
    }).join(urlSeperator);
};

export const routes = {
    root: '/',
    static: '/static',
    profile: '/profile',
    admin: {
        entry: '/admin',
        data: '/admin/data/:model',
    },
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
        image: '/image/:size?', // @todo: extend with /:user if needed -> requires a username? userId?
        resetPassword: '/resetPassword', // @todo: prevent mixing use cases (dialog and API)
        passwordChange: '/passwordChange',  // @todo: prevent mixing use cases (dialog and API)
        passwordResetRequest: '/requestPasswordReset',
        passwordReset: '/resetPassword/:resetPasswordToken',
        register: '/register',
    },
};
