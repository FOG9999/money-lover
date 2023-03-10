/**
 * Routes module for parsing requests
 */
 const async = require('async');
 const consts = require(__config_path + "/consts");
 const validator = require('validator');
 const log = require(__libs_path + '/log');
 
 module.exports = function(app) {
 
     function rest(req, res) {
         var api_name = req.params.api_name;
         if (validator.isNull(api_name))
             return res.send(400, {
                 code: 400,
                 message: 'ERROR_API_NAME_MISSING'
             });
         api_name = api_name.toLowerCase();
         var method = req.method.toLowerCase();
         // if add, update, delete api, then only support post method
         var splitApi = api_name.split('.');
         if (['add', 'update', 'delete'].indexOf(splitApi[splitApi.length - 1].toLowerCase()) > -1 && method !== 'post') {
             return res.send(400, {
                 code: 400,
                 message: 'ERROR_METHOD_NOT_SUPPORT'
             });
         }
 
         var func = consts.api[api_name];
         if (func && func.length > 0) {
             var previous = {
                 model: null,
                 data: null,
                 set: function(model) {
                     if (model && model.constructor.name === 'model') {
                         this.model = model;
                         this.data = model.toObject();
                     } else {
                         this.data = model;
                     }
                 }
             };
             async.applyEachSeries(func, req, previous, function(err, data) {
                 if (err) {
                     if (typeof err === 'object') {
                         if (err.name === 'ValidationError' && err.errors) {
                             var message = "ERROR";
                             for (var k in err.errors) {
                                 message = err.errors[k].message.toUpperCase()
                             }
                             return res.send(400, {
                                 code: 400,
                                 message: message
                             });
                         } else if (err.name === 'Error' && err.message) {
                             return res.send(400, {
                                 code: 400,
                                 message: err.message,
                                 data: previous ? previous.data : undefined
                             });
                         } else {
                             var errCode = Date.now();
                             log.error({
                                 code: errCode,
                                 stack: err.stack || err.toString(),
                                 message: err.message,
                                 params: req.params
                             });
                             return res.send(500, {
                                 code: errCode,
                                 message: 'ERROR_SERVER'
                             });
                         }
                     } else {
                         return res.send(400, {
                             code: 400,
                             message: err,
                             data: previous ? previous.data : undefined
                         });
                     }
                 }
                 if ((previous && previous.data) || data[data.length - 1]) {
                     return res.send(200, previous && previous.data ? previous.data : data[data.length - 1]);
                 } else {
                     return res.send(200, consts.message_ok);
                 }
             });
         } else {
             return res.send(400, {
                 code: 400,
                 message: 'ERROR_API_NAME_NOT_FOUND'
             });
         }
     }
 
     /**
      * ?????t global router cho ph????ng th???c GET
      *
      * @param path
      * @param request
      * @param response
      */
     app.get('/api/rest', function(req, res, next) {
         rest(req, res, next);
     });
 
     /**
      * ?????t global router cho ph????ng th???c POST
      *
      * @param path
      * @param request
      * @param response
      */
     app.post('/api/rest', function(req, res, next) {
         rest(req, res, next);
     });
 
 };
 