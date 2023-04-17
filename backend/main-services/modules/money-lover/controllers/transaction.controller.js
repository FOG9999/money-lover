const Transaction = require('../models/transaction');
const validator = require('validator');
const async = require('async');
const fs = require('fs');

const listTransactions = (req, returnData, callback) => {
    const { search, isDelete } = req.params;
    let user = req.user;

    const query = {
        $or: [
            // {
            //     name: new RegExp(search, 'i')
            // },
            // {
            //     code: new RegExp(search, 'i')
            // }
            {
                user: user._id
            }
        ]
    };
    if (!validator.isNull(isDelete)) {
        query['isDelete'] = isDelete;
    }
    else query['isDelete'] = false;

    Transaction
        .find()
        .where(query)
        .populate("budget")
        .populate("category")
        .populate("wallet")
        .exec((err, results) => {
            if (err) return callback(err);
            returnData.set(results);
            callback();
        })
}

const getTransaction = (req, returnData, callback) => {
    let id = req.params.id;

    Transaction
        .findOne({ _id: id })
        .populate("budget")
        .populate("category")
        .populate("wallet")
        .exec((err, data) => {
            if (err) return callback(err);
            if (!data) return callback('ERROR_TRANSACTION_NOT_FOUND');
            returnData.set(data);
            callback();
        })
}

const addTransaction = (req, returnData, callback) => {
    const { amount, budget, category, note, wallet } = req.params;
    const user = req.user;

    if (validator.isNull(category)) {
        return callback('ERROR_CATEGORY_MISSING');
    }

    if (validator.isNull(wallet)) {
        return callback('ERROR_WALLET_MISSING');
    }

    async.series([
        function (cb) {
            let newTransaction = new Transaction({
                amount,
                budget,
                user: user._id,
                category,
                wallet,
                note,
                dateCreated: new Date()
            })
            newTransaction.save((err, result) => {
                if (err) cb(err);
                else {
                    cb(null, result);
                }
            })
        }
    ], (err, data) => {
        if (err) return callback(err);
        returnData.set(data);
        callback();
    })

}

const updateTransaction = (req, returnData, callback) => {
    let { amount, budget, category, note } = req.params;

    if (validator.isNull(category)) {
        return callback('ERROR_CODE_MISSING');
    }

    Transaction
        .findOne()
        .where({ _id: id })
        .exec((err, result) => {
            if (err) {
                return callback(err);
            }
            if (!result) {
                return callback('ERROR_TRANSACTION_NOT_FOUND');
            }
            else {
                utils.merge(result, { amount, budget, category, note });
                result.save(function (error, data) {
                    if (error) return callback(error);
                    returnData.set(data);
                    callback();
                });
            }
        })
}

const deleteTransaction = (req, returnData, callback) => {
    let { id } = req.params;

    if (validator.isNull(id)) {
        return callback('ERROR_ID_MISSING');
    }

    Transaction
        .update({
            _id: id
        }, {
            $set: {
                isDelete: true
            }
        }, (err, data) => {
            if (err) return callback(err);
            callback();
        })
}

exports.deleteTransaction = deleteTransaction;
exports.listTransactions = listTransactions;
exports.addTransaction = addTransaction;
exports.getTransaction = getTransaction;
exports.updateTransaction = updateTransaction;