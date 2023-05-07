const Transaction = require('../models/transaction');
const validator = require('validator');
const async = require('async');
const fs = require('fs');
const utils = require(__libs_path + '/utils');
const Category = require('../models/category')
const Wallet = require('../models/wallet')
const WalletType = require('../models/wallet-type')

/**
 * read from money lover report
 */
const readMoneyLoverReport = (req, returnData, callback) => {
    const { file } = req.files;
    utils.readExcel(file, result => {
        const sheetName = Object.keys(result)[0];
        if (sheetName) {
            const categories = result[sheetName].map(row => row.CATEGORY);
            const wallets = result[sheetName].map(row => row.WALLET);
            //#region mapping transactions with categories and wallets in this database
            async.series([
                cb => {
                    Wallet
                        .find()
                        .where({
                            isDelete: false
                        })
                        .populate({
                            path: "walletType",
                            // filter wallet types
                            match: {
                                name: { $in: wallets }
                            }
                        })
                        .exec((err, data) => {
                            if (err) cb(err);
                            else {
                                cb(null, data);
                            }
                        })
                },
                cb => {
                    Category
                        .find()
                        .where({
                            isDelete: false,
                            name: { $in: categories }
                        })
                        .exec((err, data) => {
                            if (err) cb(err);
                            else {
                                cb(null, data);
                            }
                        })
                }
            ], (err, data) => {
                const walletsWithTypes = data[0].filter(w => w.walletType)
                const transactions = result[sheetName];
                transactions.forEach(tran => {
                    tran.CATEGORY = data[1].find(cate => cate.name == tran.CATEGORY)
                    tran.WALLET = walletsWithTypes.find(wallet => wallet.walletType.name == tran.WALLET)
                    tran.notIncludeInReport = tran["EXCLUDE REPORT"] == "True" ? true: false;
                    tran.dateCreatedObj = utils.transformDateFromString(tran.DATE)
                })
                //#endregion
                returnData.set(transactions)
                callback()
            })
        }
    }, err => {
        callback(err)
    })
}

/**
 * save after readMoneyLoverReport
 */
const saveDataMoneyLover = (req, returnData, callback) => {
    const {transactions} = req.params;
    Transaction
        .insertMany(transactions)
        .exec((err, data) => {
            if(err) callback(err);
            else {
                returnData.set({
                    inserted: transactions.length
                });
                callback();
            }
        })
}

exports.readMoneyLoverReport = readMoneyLoverReport;
exports.saveDataMoneyLover = saveDataMoneyLover;