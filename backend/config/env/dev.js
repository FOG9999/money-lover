module.exports = {
    port: 8081,
    mode: 'dev',
    db: {
        system: {
            replica: {
                // primary node
                primary: {
                    db_host: 'localhost',
                    db_port: 27018,
                    db_user: "fog9999",
                    db_pass: "fog9999",
                },
                // secondary node
                secondary: {
                    db_host: 'localhost',
                    db_port: 27019,
                    db_user: "fog9999",
                    db_pass: "fog9999"
                },
            },
            db_prefix: 'mongodb',
            db_database: 'my-money-lover',
            db_replica_name: "rs0",
            db_auth_src: "my-money-lover"
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