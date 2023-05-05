const Transaction = require('../models/transaction');
const validator = require('validator');
const async = require('async');
const fs = require('fs');
const utils = require(__libs_path + '/utils');

const importFromMoneyLover = (req, returnData, callback) => {
    const {file} = req.files;
    utils.readExcel(file, workbook => {
        returnData.set(workbook)
        callback()
    }, err => {
        callback(err)
    })
}

exports.importFromMoneyLover = importFromMoneyLover;