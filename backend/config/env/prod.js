module.exports = {
    port: '8081',
    mode: 'prod',
    db: {
        system: {
            replica: {
                one: {
                    db_host: '172.31.19.224',
                    db_port: 27018,
                    db_user: "rwUser",
                    db_pass: "Khongcanhoi123%21_rwUser",
                },
                two: {
                    db_host: '172.31.19.224',
                    db_port: 27019,
                    db_user: "rwUser",
                    db_pass: "Khongcanhoi123%21_rwUser"
                },
                three: {
                    db_host: '172.31.19.224',
                    db_port: 27017,
                    db_user: "rwUser",
                    db_pass: "Khongcanhoi123%21_rwUser"
                },
            },
            db_prefix: 'mongodb',
            db_database: 'my-money-lover',
            db_replica_name: "my_ml_rs",
            db_auth_src: "admin"
        }
    },
    host: '172.31.19.224'
}