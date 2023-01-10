module.exports = {
    root: require('path').normalize(__dirname + '/../..'),
    port: 8080,
    redis: {
        host: 'localhost',
        port: 6379
    },
    app: {
        name: 'My money lover',
        version: '1.0.0'
    },
    host: 'basement'
}