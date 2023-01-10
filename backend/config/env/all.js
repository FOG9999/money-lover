module.exports = {
    root: require('path').normalize(__dirname + '/../..'),
    port: 8080,
    redis: {
        host: '10.61.173.2',
        port: 6379
    },
    app: {
        name: 'My money lover',
        version: '1.0.0'
    },
    host: 'basement'
}