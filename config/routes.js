import deepFreeze from 'deep-freeze';

export default deepFreeze({
    user: {
        confirm: '/confirm/:token',
        login: '/login',
        logout: '/logout',
        passwordChange: '/passwordChange', //@todo implement
        passwordResetRequest: '/requestPasswordReset',
        passwordReset: '/resetPassword/:resetPasswordToken',
        register: '/register'
    }
});