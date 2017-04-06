import deepFreeze from 'deep-freeze';

export default deepFreeze({
    root: '/',
    static:'/static',
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
    user: {
        confirm: '/confirm/:token',
        login: '/login',
        logout: '/logout',
        resetPassword: '/resetPassword', //@todo: prevent mixing use cases (dialog and API)
        passwordChange: '/passwordChange',  //@todo: prevent mixing use cases (dialog and API)
        passwordResetRequest: '/requestPasswordReset',
        passwordReset: '/resetPassword/:resetPasswordToken',
        register: '/register',
    },
});