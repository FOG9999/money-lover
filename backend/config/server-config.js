const restify = require('restify');
const helmet = require('helmet');
const moment = require('moment');
const consts = require(__config_path + '/consts');
const log = require(__libs_path + '/log');
const util = require('util');
const config = require('./config');
const winstonLogger = require('../libs/winston');

module.exports = function (app) {
    // fix for moment inValid date
    moment.createFromInputFallback = function (config) {
        // unreliable string magic, or
        config._d = new Date(config._i);
    };

    app.pre(restify.pre.sanitizePath());
    app.pre(restify.pre.userAgentConnection());

    app.use(restify.authorizationParser());
    app.use(restify.queryParser());
    app.use(restify.gzipResponse());
    app.use(restify.bodyParser());

    // Use helmet to secure Express headers
    app.use(helmet());

    // config allow cross domain
    if (consts.enableCORS) {
        restify.CORS.ALLOW_HEADERS.push('authorization');
        restify.CORS.ALLOW_HEADERS.push('x-requested-with');
        restify.CORS.origins.push("http://localhost:4200")
        app.use(restify.CORS());
    }

    var os = require('os');
    console.log('os: ' + os.platform() + ', ' + os.release());
    // handle uncaught exception, return status code 500
    app.on('uncaughtException', (req, res, route, err) => {
        uncaughtException(err, res, req.params);
    })

    process.on('uncaughtException', (err) => {
        uncaughtException(err);
        process.exit(1);
    })

    // if (config.track_memleak) {
    //     const memwatch = require('node-memwatch');
    //     const heapdump = require('heapdump');
    //     let snapshotTaken = false,
    //         hd;

    //     memwatch.on('leak', function (info) {
    //         if (hd) {
    //             var diff = hd.end();
    //             snapshotTaken = false;
    //             // log it
    //             var errorCode = Date.now();
    //             log.error({
    //                 code: errorCode,
    //                 message: 'Memory Leak',
    //                 stack: util.inspect(diff, {
    //                     showHidden: false,
    //                     depth: 4
    //                 }),
    //                 params: info
    //             });
    //             heapdump.writeSnapshot('log/' + errorCode + '.heapsnapshot');
    //         }
    //     });


    //     memwatch.on('stats', function () {
    //         if (snapshotTaken === false) {
    //             hd = new memwatch.HeapDiff();
    //             snapshotTaken = true;
    //         }
    //     });
    // }
};

function uncaughtException(err, res, params) {
    // log it
    var errorCode = Date.now();
    winstonLogger.error(JSON.stringify({
        code: errorCode,
        stack: err.stack,
        message: err.message,
        params: params || ''
    }))
    // respond with 500 'Internal Server Error'.
    if (res && !res._headerSent) {
        res.send(500, {
            code: errorCode,
            message: 'ERROR_SERVER'
        });
    }
}
