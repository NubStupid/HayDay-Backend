module.exports = {
    hayday_connection: {
        host: process.env.DB_HOST,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        port: process.env.DB_PORT,
        database: process.env.DB_DBNAME,
        dialect: "mysql",
    },
};
