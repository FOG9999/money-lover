const Promise = require("bluebird");
const utils = require('./utils');

function Transaction(mongoose) {

    let transacts = {};
    let updateOrRemoveObjects = {};
    let taskCount = 0;

    this.insert = function(collectionName, data) {
        let Model = mongoose.model(collectionName);
        if (!Model)
            throw new Error('Collection not found');
        updateOrRemoveObjects[taskCount] = {
            Model: Model,
            data: data,
            type: 'insert',
            taskId: taskCount
        };
        taskCount++;
    };

    this.update = function(collectionName, objectId, data) {
        let Model = mongoose.model(collectionName);
        if (!Model)
            throw new Error('Collection not found');
        updateOrRemoveObjects[taskCount] = {
            objectId: objectId,
            data: data,
            Model: Model,
            type: 'update',
            taskId: taskCount
        };
        taskCount++;
    };

    this.remove = function(collectionName, objectId) {
        let Model = mongoose.model(collectionName);
        if (!Model)
            throw new Error('Collection not found');
        updateOrRemoveObjects[taskCount] = {
            objectId: objectId,
            Model: Model,
            type: 'remove',
            taskId: taskCount
        };
        taskCount++;
    };

    this.run = function(callback) {
        if (taskCount === 0) return Promise.resolve();
        return new Promise((resolve, reject) => {
            for (let key in updateOrRemoveObjects) {
                let docData = updateOrRemoveObjects[key];
                transacts[key] = getTask(docData);
            }
            Promise.props(transacts).then((tasks) => {
                let taskPromises = [];
                for (let i = 0; i < taskCount; i++) {
                    if (tasks[i]) {
                        taskPromises.push({docData: updateOrRemoveObjects[i], task: tasks[i]});
                    }
                }
                let docs = [];
                let successDocData = [];
                Promise.each(taskPromises, (item, index) =>
                    item.task().then((data) => {
                        successDocData.push(data.docData);
                        docs.splice(index, 0, data.doc);
                    }).catch(err => Promise.reject(new Error('[Transaction] error at Task: ' + item.docData.taskId + ', action: ' + item.docData.type + ', objectId: ' + item.docData.objectId + ', message: ' + err.message)))
                ).then(() => {
                    if (callback) return callback(null, docs);
                    else return resolve(docs);
                }).catch((err) => {
                    utils.error('[Transaction] rollback is starting');
                    successDocData = successDocData.reverse();
                    Promise.each(successDocData, function(docData) {
                        return rollback(docData);
                    }).then(() => {
                        if (callback) return callback(err);
                        else return reject(err);
                    }).catch((err2) => {
                        utils.error('[Transaction] rollback error');
                        if (callback) return callback(err2);
                        else return reject(err2);
                    });
                });
            }).catch(ex => reject(ex));
        });
    };

    function getTask(docData) {
        return new Promise((resolve, reject) => {
            if (docData.type === 'insert') {
                resolve(constructInsertTask(docData));
            } else {
                docData.Model.findById(docData.objectId).then((oldDoc) => {
                    var task = null;
                    docData.oldDoc = oldDoc;
                    if (docData.type === 'update') {
                        task = constructUpdateTask(docData);
                    } else if (docData.type === 'remove') {
                        task = constructRemoveTask(docData);
                    }
                    resolve(task);
                }).catch(ex => reject(ex));
            }
        });
    }

    function rollback(docData) {
        if (!docData || !docData.doc && !docData.oldDoc) {
            return Promise.resolve();
        } else if (docData.type === 'insert') {
            utils.error('[Transaction] rollback insert ' + docData.doc.collection.name);
            return docData.doc.remove();
        } else if (docData.type === 'update') {
            utils.error('[Transaction] rollback update ' + docData.doc.collection.name);
            for (var key in docData.oldDoc) {
                docData.doc[key] = docData.oldDoc[key];
            }
            return docData.doc.save();
        } else if (docData.type === 'remove') {
            utils.error('[Transaction] rollback remove ' + docData.doc.collection.name);
            var oldDocData = JSON.parse(JSON.stringify(docData.oldDoc));
            var oldDoc = new docData.Model(oldDocData);
            return oldDoc.save();
        } else {
            return Promise.resolve();
        }
    }

    function constructUpdateTask(docData) {
        return () => new Promise((resolve, reject) => {
            var oldDocData = JSON.parse(JSON.stringify(docData.oldDoc));
            delete oldDocData['__v']; // fix for ignore versioning
            docData.doc = docData.oldDoc;
            for (var key in docData.data) {
                docData.doc[key] = docData.data[key];
            }
            docData.doc.save().then((doc) => {
                docData.oldDoc = oldDocData;
                resolve({
                    docData: docData,
                    doc: doc
                });
            }).catch(ex => reject(ex));
        });
    }

    function constructRemoveTask(docData) {
        return () => new Promise((resolve, reject) => {
            docData.oldDoc.remove().then((doc) => {
                resolve({
                    docData: docData,
                    doc: doc
                });
            }).catch(ex => reject(ex));
        });
    }

    function constructInsertTask(docData) {
        return () => new Promise((resolve, reject) => {
            var model = new docData.Model(docData.data);
            model.save().then((doc) => {
                docData.doc = doc;
                resolve({
                    docData: docData,
                    doc: doc
                });
            }).catch(ex => reject(ex));
        });
    }
}

module.exports = function(mongoose) {
    return function() {
        return new Transaction(mongoose);
    };
};
