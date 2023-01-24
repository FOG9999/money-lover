const Wallet = require('../models/wallet');
const validator = require('validator');
const async = require('async');
const fs = require('fs');

const listWallets = (req, returnData, callback) => {
    const { search, isDelete } = req.params;

    const query = {
        $or: [{
            name: new RegExp(search, 'i')
        }, {
            code: new RegExp(search, 'i')
        }]
    };
    if (!validator.isNull(isDelete)) {
        query['isDelete'] = isDelete;
    }

    Wallet
        .find()
        .where(query)
        .populate("walletType")
        .exec((err, results) => {
            if (err) return callback(err);
            returnData.set(results);
            callback();
        })
}

const getWallet = (req, returnData, callback) => {
    let id = req.params.id;

    Wallet
        .findOne({ _id: id })
        .populate("walletType")
        .exec((err, data) => {
            if (err) return callback(err);
            if (!data) return callback('ERROR_WALLET_NOT_FOUND');
            returnData.set(data);
            callback();
        })
}

const addWallet = (req, returnData, callback) => {
    const { amount, walletType, includedInTotal, isDefault } = req.params;
    const user = req.user;

    if (validator.isNull(walletType)) {
        return callback('ERROR_WALLETTYPE_MISSING');
    }

    async.series([
        function (cb) {
            Wallet
                .findOne()
                .where({ walletType: walletType })
                .exec((err, data) => {
                    if (err) {
                        cb(err);
                    }
                    if (data) {
                        cb('ERROR_WALLET_EXIST');
                    }
                    else cb();
                })
        },
        function (cb) {
            let newWallet = new Wallet({
                amount,
                walletType,
                user,
                includedInTotal,
                isDefault,
                dateCreated: new Date()
            })
            newWallet.save((err, result) => {
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

const updateWallet = (req, returnData, callback) => {
    let { walletType, includedInTotal, isDefault } = req.params;

    if (validator.isNull(walletType)) {
        return callback('ERROR_WALLETTYPE_MISSING');
    }

    Wallet
        .findOne()
        .where({ _id: id })
        .exec((err, result) => {
            if (err) {
                return callback(err);
            }
            if (!result) {
                return callback('ERROR_WALLET_NOT_FOUND');
            }
            else {
                utils.merge(result, { walletType, includedInTotal, isDefault });
                result.save(function (error, data) {
                    if (error) return callback(error);
                    returnData.set(data);
                    callback();
                });
            }
        })
}

const deleteWallet = (req, returnData, callback) => {
    let { id } = req.params;

    if (validator.isNull(id)) {
        return callback('ERROR_ID_MISSING');
    }

    Wallet
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

exports.deleteWallet = deleteWallet;
exports.listWallets = listWallets;
exports.addWallet = addWallet;
exports.getWallet = getWallet;
exports.updateWallet = updateWallet;