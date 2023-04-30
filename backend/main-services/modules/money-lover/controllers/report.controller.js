const Transaction = require('../models/transaction');
const validator = require('validator');
const async = require('async');
const fs = require('fs');
const consts = require('../../../../config/consts');
const utils = require(__libs_path + '/utils');

const getAveragePerMonth = (req, returnData, callback) => {
    let user = req.user;
    const { year } = req;
    const current = new Date();

    const query = {
        dateCreated: {
            $gt: new Date(year ? year : current.getFullYear(), 0, 1)
        },
        user: user._id
    };

    Transaction
        .find()
        .where(query)
        .populate('category')
        .exec((err, result) => {
            if (err) return callback(err);
            const sumIncome = result.filter(x => x.category.transactionType == consts.type_income).reduce((pre, curr) => ({ amount: curr.amount + pre.amount }), { amount: 0 }).amount;
            const sumOutcome = result.filter(x => x.category.transactionType == consts.type_outcome).reduce((pre, curr) => ({ amount: curr.amount + pre.amount }), { amount: 0 }).amount;
            const averageIncome = Math.round(sumIncome / (current.getMonth() + 1));
            const averageOutcome = Math.round(sumOutcome / (current.getMonth() + 1));
            returnData.set({ averageIncome, averageOutcome, sumIncome, sumOutcome });
            callback();
        })
}

const getOverallEveryMonth = (req, returnData, callback) => {
    let user = req.user;
    const { year } = req;
    const current = new Date();

    const query = {
        dateCreated: {
            $gt: new Date(year ? year : current.getFullYear(), 0, 1)
        },
        user: user._id
    };

    Transaction
        .find()
        .where(query)
        .populate('category')
        .exec((err, result) => {
            if (err) return callback(err);
            const overall = {
                income: [],
                outcome: []
            };
            for (let i = 0; i < consts.months.length; i++) {
                if (i <= current.getMonth()) {
                    const transactionsInMonth = result.filter(x => new Date(x.dateCreated).getMonth() == i);
                    overall.income.push(
                        transactionsInMonth.filter(x => x.category.transactionType == consts.type_income).reduce((pre, curr) => ({ amount: curr.amount + pre.amount }), { amount: 0 }).amount,
                    )
                    overall.outcome.push(
                        transactionsInMonth.filter(x => x.category.transactionType == consts.type_outcome).reduce((pre, curr) => ({ amount: curr.amount + pre.amount }), { amount: 0 }).amount
                    )
                }
                else {
                    overall.income.push(0);
                    overall.outcome.push(0);
                }
            }
            returnData.set({ ...overall })
            callback();
        })
}

exports.getAveragePerMonth = getAveragePerMonth;
exports.getOverallEveryMonth = getOverallEveryMonth;