module.exports = {
    port: '8082',
    mode: 'prod',
    db: {
        system: {
            db_host: 'localhost',
            db_port: 27017,
            db_prefix: 'mongodb',
            db_database: 'system-base'
        }
    }
}