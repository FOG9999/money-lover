const ws = require('ws');
const winstonLogger = require('../libs/winston');
const utils = require('../libs/utils');
const redis = require('../libs/redis');
const consts = require(__config_path + '/consts');

// set token for this server to pass websocket's authentication
const serverTokenForWS = utils.randomstring(50);
redis.HSET(consts.redis_key.server, serverTokenForWS, JSON.stringify({name: 'my-ml-be'}), (err) => {
    winstonLogger.error(`write redis server token for ws failed: ${JSON.stringify(err)}`);
    const wsClient = new ws.WebSocket(`${process.env.WS_LAMBDA_URL}?user=my-ml-be&t=${serverTokenForWS}`);
    
    wsClient.on('open', () => {
        winstonLogger.info('websocket opened.');
    })
    
    wsClient.on('error', (err) => {
        winstonLogger.error('websocket error: ' + JSON.stringify(err));
    })
    
    wsClient.on('close', () => {
        winstonLogger.info("websocket closed");
    })
})
