'use strict';

const Promise = require("bluebird");
const async = require('async');
const fs = require('fs');
const _ = require('lodash');
const validator = require('validator');
const moment = require('moment');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const mongoose = require('mongoose');
const dataDb = require(__db_path + '/system-db');
const Query = mongoose.Query;
const ObjectId = mongoose.Types.ObjectId;
const consts = require(__config_path + '/consts');
const config = require(__config_path + '/config');
const xlsx = require('xlsx');
const formidable = require("formidable");

exports.arrayIndexOf = arrayIndexOf
exports.arrayFilter = arrayFilter
exports.clearModel = clearModel
exports.merge = merge
exports.arrayPaging = arrayPaging
exports.randomInt = randomInt
exports.convertModelToObject = convertModelToObject
exports.convertObjectToArray = convertObjectToArray
exports.randomstring = randomstring

/**
 * Index of object within an array
 *
 * @param {Array} arr
 * @param {Object} obj
 * @return {Number}
 */
function arrayIndexOf(arr, obj) {
    var index = -1; // not found initially
    var keys = Object.keys(obj);
    // filter the collection with the given criterias
    arr.filter((doc, idx) => {
        // keep a counter of matched key/value pairs
        var matched = 0;

        // loop over criteria
        for (var i = keys.length - 1; i >= 0; i--) {
            if (keys[i].indexOf('.') > -1) {
                var keySplit = keys[i].split('.');
                if (doc[keySplit[0]][keySplit[1]] && obj[keys[i]] && doc[keySplit[0]][keySplit[1]].toString() === obj[keys[i]].toString()) {
                    matched++;

                    // check if all the criterias are matched
                    if (matched === keys.length) {
                        index = idx;
                        return idx;
                    }
                }
            } else if (doc[keys[i]] && obj[keys[i]] && doc[keys[i]].toString() === obj[keys[i]].toString()) {
                matched++;

                // check if all the criterias are matched
                if (matched === keys.length) {
                    index = idx;
                    return idx;
                }
            }
        }
        return -1;
    });
    return index;
}

function arrayFilter(arr, obj) {
    var keys = Object.keys(obj);
    var r = [];
    // filter the collection with the given criterias
    arr.filter((doc, idx) => {
        // keep a counter of matched key/value pairs
        var matched = 0;

        // loop over criteria
        for (var i = keys.length - 1; i >= 0; i--) {
            if (keys[i].indexOf('.') > -1) {
                var keySplit = keys[i].split('.');
                if (doc[keySplit[0]][keySplit[1]] && obj[keys[i]] && doc[keySplit[0]][keySplit[1]].toString() === obj[keys[i]].toString()) {
                    matched++;
                    // check if all the criterias are matched
                    if (matched === keys.length) {
                        r.push(doc);
                        return idx;
                    }
                }
            } else if (doc[keys[i]] && obj[keys[i]] && doc[keys[i]].toString() === obj[keys[i]].toString()) {
                matched++;

                // check if all the criterias are matched
                if (matched === keys.length) {
                    r.push(doc);
                    return idx;
                }
            }
        }
        return -1;
    });
    return r;
}

/**
 * [clearModel description]
 * @param  {[type]}   modelName [description]
 * @param  {Function} callback  [description]
 * @return {[type]}             [description]
 */
function clearModel(modelName, callback) {
    var Model = dataDb.model(modelName);
    Model.remove({}, function (err) {
        callback(err);
    })
}

/**
 * Hàm merge dữ liệu, hỗ trợ merge mảng
 *
 * @param  {[type]} obj [description]
 * @param  {[type]} src [description]
 * @return {[type]}     [description]
 */
function merge(obj, src) {
    _.merge(obj, src, function (a, b) {
        if (_.isArray(a)) {
            if (b !== null && b !== undefined) {
                if (_.isArray(b)) {
                    return [].concat(b);
                } else {
                    return b;
                }
            } else {
                return a;
            }
        }
    });
}

/**
 * phân trang cho mảng
 *
 * @param  {[type]} array [description]
 * @param  {[type]} req   [description]
 * @return {[type]}       [description]
 */
function arrayPaging(array, req) {
    var page = req.params.page;
    var page_size = req.params.page_size;
    var order_by = req.params.order_by;
    // xử lý page
    if (validator.isNull(page))
        page = 1;
    if (validator.isInt(page))
        page = parseInt(page, 10);
    else
        page = 1;
    if (page === 0) page = 1;

    // xử lý page_size
    if (validator.isNull(page_size))
        page_size = consts.page_size;
    if (validator.isInt(page_size))
        page_size = parseInt(page_size, 10);
    else
        page_size = consts.page_size;
    if (page_size === 0) page_size = consts.page_size;
    if (page_size < 0) page_size = array.length;

    //sap xep
    if (typeof order_by === 'string') {
        var arrange = 'asc';
        if (order_by.indexOf('-') === 0) {
            arrange = 'desc';
            order_by = order_by.substring(1);
        }
        array = _.sortByOrder(array, order_by, arrange);
    }
    return {
        item_total: array.length,
        page_count: array.length === 0 ? 0 : ~~((array.length - 1) / page_size) + 1,
        page: page,
        page_size: page_size,
        data: array.splice((page - 1) * page_size, page_size)
    };
}

/**
 * This function generates random integer between two numbers low (inclusive) and high (exclusive) ([low, high))
 *
 * @param  {[type]} low  [description]
 * @param  {[type]} high [description]
 * @return {[type]}      [description]
 */
function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

/**
 * convert mongoose model to javascript object
 *
 * @param  {[type]} model [description]
 * @return {[type]}       [description]
 */
function convertModelToObject(model) {
    if (Array.isArray(model)) {
        var result = [];
        for (var j = 0; j < model.length; j++) {
            if (model[j] && model[j]._doc) {
                result.push(model[j].toJSON());
            } else {
                result.push(model[j]);
            }
        }
        return result;
    } else if (model) {
        if (model._doc) {
            return model.toJSON();
        } else {
            return model;
        }
    } else {
        return model;
    }
}

/**
 * chuyển từ object thành mảng {_id, name}, dùng để lấy danh mục
 *
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
function convertObjectToArray(obj) {
    var keys = Object.keys(obj);
    var result = [];
    for (var i = 0; i < keys.length; i++) {
        result.push({
            _id: parseInt(keys[i], 10),
            name: obj[keys[i]]
        });
    }
    return result;
}

/**
 * lấy chuỗi ngầu nhiên để generate ra password
 *
 * @param  {[type]} len  [description]
 * @param  {[type]} type [description] numbers_uppercases_lowercases
 * @return {[type]}      [description]
 */
function randomstring(len, type) {

    len = len || 20;
    type = type || 'numbers_uppercases_lowercases';

    var strings = {
        numbers: '0123456789',
        uppercases: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercases: 'abcdefghiklmnopqrstuvwxyz'
    },
        choise = '',
        ret = '',
        types = type.split('_');

    for (let i = 0; i < types.length; i++) {
        if (strings[types[i]]) {
            choise += strings[types[i]];
        }
    }

    if (!choise) {
        choise = strings.numbers + strings.lowercases + strings.uppercases;
    }

    for (let i = 0; i < len; i++) {
        ret += choise[Math.floor(Math.random() * choise.length)];
    }

    return ret;
}

/**
 * make query paging
 *
 * @param  {[type]} req   [description]
 * @param  {[type]} query [description]
 * @return {[type]}       [description]
 */
Query.prototype.paging = function (req, callback) {
    var page = req.params.page;
    var page_size = req.params.page_size;
    var order_by = req.params.order_by;
    var custom_filter = req.params.custom_filter;

    // xử lý page
    if (validator.isNull(page))
        page = 1;
    if (validator.isInt(page))
        page = parseInt(page, 10);
    else
        page = 1;
    if (page === 0) page = 1;

    // xử lý page_size
    if (validator.isNull(page_size))
        page_size = consts.page_size;
    if (validator.isInt(page_size))
        page_size = parseInt(page_size, 10);
    else
        page_size = consts.page_size;
    if (page_size === 0) page_size = consts.page_size;
    var query = this;

    var model = query.model;

    var filter = req.params.filter;
    if (!validator.isNull(filter)) {
        if (typeof filter === 'string') {
            try {
                filter = JSON.parse(filter);
            } catch (ex) {
                filter = null;
            }
        }
        if (filter) {
            // get all keys of object
            var keys = Object.keys(filter);
            for (var i = 0; i < keys.length; i++) {
                // convert to regular express
                if (!validator.isInt(filter[keys[i]]) && filter[keys[i]] !== 'true' && filter[keys[i]] !== 'false') {
                    filter[keys[i]] = new RegExp(filter[keys[i]], 'i');
                }
            }
        }
    } else {
        filter = {};
    }

    // default filter condition, is_delete is false or not exists
    query._conditions = {
        $and: [query._conditions, {
            '$or': [{
                "is_delete": {
                    $exists: false
                }
            }, {
                "is_delete": false
            }]
        }]
    };
    if (!validator.isNull(custom_filter)) {
        try {
            if (typeof custom_filter === 'string') {
                custom_filter = JSON.parse(custom_filter);
            }
            query._conditions['$and'].push(custom_filter);
        } catch (ex) { }
    }

    return new Promise((resolve, reject) => {
        async.parallel([function (cb) {
            model.count()
                .where(query._conditions)
                .where(filter)
                .exec(function (err, cnt) {
                    if (err) {
                        return cb(err);
                    } else {
                        return cb(null, cnt);
                    }
                });
        }, function (cb) {
            // paging
            if (page_size > 0) {
                query.skip((page - 1) * page_size);
                query.limit(page_size)
            }
            // order by
            if (!validator.isNull(order_by)) {
                if (Array.isArray(order_by)) {
                    var sort = {};
                    for (var x = 0; x < order_by.length; x++) {
                        var dir = order_by[x].substr(0, 1);
                        var field = order_by[x].substr(1);
                        sort[field] = dir === '+' ? 1 : -1
                    }
                    query.sort(sort);
                } else {
                    query.sort(order_by);
                }
            } else if (query.options && !query.options.sort) {
                //default sort by dateCreated
                query.sort({
                    dateCreated: -1
                });
            }
            query
                .where(filter)
                .exec(function (err, data) {
                    if (err) {
                        return cb(err);
                    } else {
                        return cb(null, data);
                    }
                });
        }], function (err, result) {
            if (err) {
                if (callback) return callback(err, []);
                else return reject(err);
            } else {
                let data = exports.convertModelToObject(result[1]);
                let count = result[0];
                if (page_size < 0) page_size = count;
                let r = {
                    item_total: count,
                    page_count: count === 0 ? 0 : ~~((count - 1) / page_size) + 1,
                    page: page,
                    page_size: page_size,
                    data: data
                };
                if (callback) return callback(null, r);
                else return resolve(r);
            }
        });
    });
}

// attach paging method to Array prototype
Array.prototype.paging = function (req) {
    return exports.arrayPaging(this, req);
};

/**
 * search object in array
 * @param  {[type]} obj [description]
 * @return {[type]}           [description]
 */
Array.prototype.search = function (obj) {
    return exports.arrayIndexOf(this, obj);
}

/**
 * push log to console
 * @return {[type]} [description]
 */
exports.log = function (...args) {
    if (config.mode !== 'test') {
        console.log.apply(this, args);
    }
};

/**
 * push info to console
 * @return {[type]} [description]
 */
exports.info = function (...args) {
    if (config.mode !== 'test') {
        console.info.apply(this, args);
    }
}

/**
 * push error to console
 * @return {[type]} [description]
 */
exports.error = function (...args) {
    if (config.mode !== 'test') {
        console.error.apply(this, args);
    }
};

/**
 * utils for excel reader, return {sheetName1: []}
 */
exports.readExcel = (file, callback, handleErr) => {
    try {  
        const workbook = xlsx.readFile(file.path);   
        const sheetNames = workbook.SheetNames;
        let output = {};
        sheetNames.forEach(name => {
            output[name] = xlsx.utils.sheet_to_json(workbook.Sheets[name])
        })     
        callback(output);
    } catch (error) {
        handleErr(error)
    }
}