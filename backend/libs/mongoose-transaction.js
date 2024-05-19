const db = require('../database/system-db');
const winstonLogger = require('./winston');

const useMongooseTransaction = async (operation, errorCallback, options) => {
    if(typeof operation != "function"){
        return winstonLogger.error(`operation used to mongoose transaction is not a function:`, operation);
    }
    if(!options || typeof options != "object"){
        options = {};
    }
    const session = db.getClient().startSession();
    session.startTransaction();
    try {
        await operation(session);
        await session.commitTransaction()
    } catch (error) {
        winstonLogger.error(`Mongoose transaction caught an error: `, error);
        await session.abortTransaction();
        if(errorCallback && typeof errorCallback == 'function') errorCallback(error);
    } finally {
        await session.endSession();
    }
}

module.exports = {
    useMongooseTransaction
}