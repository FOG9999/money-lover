/**
 * Authorization middleware module
 */
 var dataDb = require(__db_path + '/system-db');
 var validator = require('validator');
 var redis = require('../libs/redis');
const winstonLogger = require('../libs/winston');
 var consts = require(__config_path + "/consts");
//  var log = require(__libs_path + '/log');
 var config = require(__config_path + '/config');
 
 /**
  * This method is check tokken for every api request
  * return 403 NotAuthorizedError when token param is missing or not correct, else next
  *
  * @param request
  * @param response
  * @param next method
  */
 exports.checkToken = function (req, res, next) {
    // check for bypass apis
    if(Array.isArray(consts.ignoreAuthorization) && consts.ignoreAuthorization.find(url => url == req.url)){        
        return next();
    }
     var api_name = req.params.api_name;
     winstonLogger.info(`${req.headers['origin']}: ${req.method}: ${JSON.stringify(req.params)}`);
     if (!api_name) {
        winstonLogger.error(`${req.headers['origin']}: ERROR_API_NAME_MISSING`);
         return res.send(400, {
             code: 400,
             message: 'ERROR_API_NAME_MISSING'
         });
     }
     api_name = api_name.toLowerCase();
    //  if (config.mode !== 'test') {
    //      log.info({
    //          'api_name': api_name,
    //          'ip': req.params.ip,
    //          'lang': req.params.lang,
    //          'agent': req.headers['user-agent']
    //      });
    //  }
     var apiNotAuth = consts.not_auth_api.indexOf(api_name) > -1;
     var apiForSystem = consts.system_api.indexOf(api_name) > -1;
     var apiForAnyAuth = consts.any_auth_api.indexOf(api_name) > -1;
 
     var token = req.headers.authorization;
     if (apiNotAuth) {
         return next();
     } else if (!validator.isNull(token)) {
        let sToken = token.split(" ");
         // phân tách token
         sToken = token.split(" ");
         if (sToken.length !== 2) {
            winstonLogger.error(`${req.headers['origin']}: ERROR_ACCESS_RESTRICTED: sToken.length !== 2`);
             return res.send(403, {
                 code: 403,
                 message: 'ERROR_ACCESS_RESTRICTED'
             });
         } else {
             token = sToken[1];
             // Having token, query user with token
             redis.HEXISTS(consts.redis_key.user, token, function (err, exists) {
                 if (err) {
                     return res.send(403, {
                         code: 400,
                         message: err.toString()
                     });
                 }
                 if (exists === 1) {
                     redis.HGET(consts.redis_key.user, token, function (err, userData) {
                         // kiểm tra api chỉ dùng cho user hệ thống
                         if (err) {
                            winstonLogger.error(`${req.headers['origin']}: ERROR_ACCESS_RESTRICTED: consts.redis_key.user == null`);
                             return res.send(403, {
                                 code: 403,
                                 message: 'ERROR_ACCESS_RESTRICTED'
                             });
                         } else {
                             var user = JSON.parse(userData);
                             if (!apiForAnyAuth && apiForSystem && user.level !== consts.user_roles.ADMIN && user.level !== consts.user_roles.SYSTEM_USER) {
                                winstonLogger.error(`${req.headers['origin']}: ERROR_ACCESS_RESTRICTED: !apiForAnyAuth && apiForSystem && user.level !== consts.user_roles.ADMIN && user.level !== consts.user_roles.SYSTEM_USER`);
                                 return res.send(403, {
                                     code: 403,
                                     message: 'ERROR_ACCESS_RESTRICTED'
                                 });
                             } else if (!apiForAnyAuth && !apiForSystem && (user.level === consts.user_roles.admin || user.level === consts.user_roles.system_user)) {
                                winstonLogger.error(`${req.headers['origin']}: ERROR_ACCESS_RESTRICTED: !apiForAnyAuth && !apiForSystem && (user.level === consts.user_roles.admin || user.level === consts.user_roles.system_user)`);
                                 return res.send(403, {
                                     code: 403,
                                     message: 'ERROR_ACCESS_RESTRICTED'
                                 });
                             }
                             req.user = user;
                             return next();
                         }
                     });
                 } else {
                    winstonLogger.error(`${req.headers['origin']}: ERROR_ACCESS_RESTRICTED`);
                     return res.send(403, {
                         code: 403,
                         message: 'ERROR_ACCESS_RESTRICTED'
                     });
                 }
             });
         }
     } else {
        winstonLogger.error(`${req.headers['origin']}: ERROR_ACCESS_RESTRICTED`);
         return res.send(403, {
             code: 403,
             message: 'ERROR_ACCESS_RESTRICTED'
         });
     }
 };