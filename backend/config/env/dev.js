module.exports = {
    port: 8081,
    mode: 'dev',
    db: {
        system: {
            db_host: '10.61.173.2',
            db_port: 27017,
            db_prefix: 'mongodb',
            db_database: 'my-money-lover',
            db_user: "fog9999",
            db_pass: "fog9999"
        },
        data: {
            db_host: '10.61.173.2',
            db_port: 27017,
            db_prefix: 'mongodb',
            db_database: 'my-money-lover'
        }
    },
    host: 'localhost'
}