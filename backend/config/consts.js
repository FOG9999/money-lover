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
        user: "redis_user_key"
    },

    user_roles: {
        ADMIN: 'ADMIN',
        SYSTEM_USER: 'SYSTEM'
    },

    enableCORS: true
}