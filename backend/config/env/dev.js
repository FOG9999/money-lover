module.exports = {
    port: 8081,
    mode: 'dev',
    db: {
        system: {
            db_host: 'localhost',
            db_port: 27018,
            db_prefix: 'mongodb',
            db_database: 'my-money-lover',
            db_user: "fog9999",
            db_pass: "fog9999"
        },
        data: {
            db_host: 'localhost',
            db_port: 27017,
            db_prefix: 'mongodb',
            db_database: 'my-money-lover'
        }
    },
    redis: {
        host: 'localhost',
        port: 6379
    },
    host: 'localhost'
}