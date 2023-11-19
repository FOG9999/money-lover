const ws = require('ws');
const winstonLogger = require('../libs/winston');
const utils = require('../libs/utils');
const redis = require('../libs/redis');
const consts = require(__config_path + '/consts');


const initClient = () => {
    // set token for this server to pass websocket's authentication
    const serverTokenForWS = utils.randomstring(50);
    redis.HSET(consts.redis_key.server, serverTokenForWS, JSON.stringify({name: 'my-ml-be'}), (err) => {
        if(err){
            winstonLogger.error(`write redis server token for ws failed: ${JSON.stringify(err)}`);
        }
        global.wsClient = new ws.WebSocket(`${process.env.WS_LAMBDA_URL}?user=my-ml-be&t=${serverTokenForWS}`);
        
        global.wsClient.on('open', () => {
            winstonLogger.info('websocket opened.');
        })
        
        global.wsClient.on('error', (err) => {
            winstonLogger.error('websocket error: ' + JSON.stringify(err));
        })
        
        global.wsClient.on('close', () => {
            winstonLogger.info("websocket closed");
        })
    })
}

const wsSendJSON = (message, topic, data) => {
    if(global.wsClient){
        global.wsClient.send(JSON.stringify({message, data, topic}));
    }
}

module.exports = {
    initClient,
    wsSendJSON: wsSendJSON
}