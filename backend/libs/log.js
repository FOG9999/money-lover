var Hipchatter = require('hipchatter');

function BunyanHipchat(options, error) {
    options = options || {};
    if (!options.token) {
        throw new Error('token cannot be null');
    } else if (!options.room_name) {
        throw new Error('room_name cannot be null');
    } else if (!options.room_token) {
        throw new Error('room_token cannot be null');
    } else {
        this.token = options.token;
        this.room_name = options.room_name;
        this.room_token = options.room_token;
        this.color = options.color || 'yellow';
        this.message_format = options.message_format || 'html';
        this.notify = options.notify || false;
        this.error = error || function() {};
        this.hipchatter = new Hipchatter(this.token);
    }
}

BunyanHipchat.prototype.write = function write(record) {
    var self = this,
        message;

    if (typeof record === 'string') {
        record = JSON.parse(record);
    }

    try {
        message = '<b>Hostname:</b> ' + record.hostname + '<br /><b>Thời gian: </b>' + record.time + '<br /><b>Mã lỗi: </b>' + record.code + '<br /><b>Dữ liệu đầu vào: </b>' + JSON.stringify(record.params) + '<br /><b>Message: </b>' + record.message + '<br /><b>Stack: </b>' + record.stack;
    } catch (err) {
        return self.error(err);
    }
    var options = {
        message: message,
        color: self.color,
        token: self.room_token,
        message_format: self.message_format,
        notify: self.notify
    };
    self.hipchatter.notify(self.room_name, options, function() {});
};

var config = require(__config_path + "/config"),
    bunyan = require('bunyan'),
    log;
if (config.mode === 'pro') {
    log = bunyan.createLogger({
        name: config.app.name,
        streams: [{
            stream: process.stdout,
            level: 'info'
        }, {
            level: 'error',
            type: 'raw', // use 'raw' to get raw log record objects
            stream: new BunyanHipchat({
                token: 'XK4Bs30AvRCWfT2Ri9wyBwK8GnSlwxcEGqDnovLv',
                room_token: 'Ro3sV5flsdQkCzqwKg4puONrDLHA0zQZ2zZwFBA3',
                room_name: 'GOS-LOG'
            })
        }, {
            level: 'error',
            path: require('path').normalize(__dirname + '/..') + '/log/api-error.log',
            type: 'rotating-file',
            period: '1d', // daily rotation
            count: 10 // keep 10 back copies
        }]
    });
} else {
    log = bunyan.createLogger({
        name: config.app.name,
        streams: [{
            stream: process.stdout,
            level: 'info'
        }, {
            stream: process.stderr,
            level: 'error'
        }]
    });
}
exports = module.exports = log;
