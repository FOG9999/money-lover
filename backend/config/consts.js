module.exports = {
    // declare schema options to show virtual field when use JSON stringify
    schemaOptions: {
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    },
    // dùng để đăng ký controller ứng với api v1 name
    api: {},

    // array url not authorize
    not_auth_api: [],
    system_api: [],
    any_auth_api: [],
    api_logging: {},

    /**
     * Đăng ký API Route với hệ thống
     *
     * @param  {[type]} apiName   [Api name]
     * @param  {[type]} func      [function or list of function]
     * @param  {[type]} options   [options {notAuth, systemApi}]
     * @return {[type]}           [description]
     */
    registerApi: function (apiName, func, options) {
        if (!func) return;
        if (options) {
            var notAuth = options.notAuth;
            var systemApi = options.systemApi;
            var anyAuthApi = options.anyAuthApi;
        }
        if (Array.isArray(func)) {
            this.api[apiName] = func;
        } else {
            if (!this.api[apiName])
                this.api[apiName] = [];
            this.api[apiName].push(func);
        }

        if (notAuth) {
            this.not_auth_api.push(apiName);
        }

        if (systemApi) {
            this.system_api.push(apiName);
        }

        if (anyAuthApi) {
            this.any_auth_api.push(apiName);
        }
    },
    // phương thức hash để mã hóa mật khẩu
    hash_method: 'sha256',

    // redis consts
    redis_key: {
        user: "redis_user_key",
        server: "redis_server",
        icon: "redis_icon_key",
        tfa: "redis_tfa_key", // two factor authentication
        forgot_password: "redis_forgot_password",
        change_password: "redis_change_password",
    },

    user_roles: {
        ADMIN: 'ADMIN',
        SYSTEM_USER: 'SYSTEM',
        USER: 'USER'
    },

    icon_prefix: "data:image/png;base64,",

    enableCORS: true,
    page_size: 10,
    icon_type: '.png',
    type_income: 1,
    type_outcome: 0,
    months: [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12",
    ],
    saltRounds: 10,
    timeKeyExpired: 180000,
    maxCountOTP: 5,
    /**
     * expired time for keys saved for otp check (in sec)
     */
    otpExpiredTime: 3000,
    /**
     * expired time for change password token
     */
    changePassTokenTime: 3000,
    /**
     * paths that ignore authorization checks
     */
    ignoreAuthorization: ['/api/health-check'],
    wsRoute: {
        notification: "notification",
        loginWarningTopic: "notify-login"
    },
    reconnectWS: 5000 // reconnect after 5s
}