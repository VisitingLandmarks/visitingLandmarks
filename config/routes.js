import deepFreeze from 'deep-freeze';

export default deepFreeze({
    root : '/',
    profile : '/profile',
    user: {
        confirm: '/confirm/:token',
        login: '/login',
        logout: '/logout',
        passwordChange: '/passwordChange', //@todo implement
        passwordResetRequest: '/requestPasswordReset',
        passwordReset: '/resetPassword/:resetPasswordToken',
        register: '/register',
    },
});