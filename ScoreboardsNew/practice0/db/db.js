const sql = require('mssql');
require('dotenv').config();

var config1 = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE1,
    options: {
        trustedConnection: false,
        trustServerCertificate: true,
        enableArithAbort: true,
        instancename: 'SQLEXPRESS'
    },
    port:parseInt(process.env.DB_PORT)
};

var config2 = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE2,
    options: {
        trustedConnection: false,
        trustServerCertificate: true,
        enableArithAbort: true,
        instancename: 'SQLEXPRESS'
    },
    port:parseInt(process.env.DB_PORT)
};


const connect1 = async () => {
    try {
        await sql.connect(config1);
        console.log('Database connected');
    } catch (err) {
        console.error('Database connection failed', err);
    }
};

const connect2 = async () => {
    try {
        await sql.connect(config2);
        console.log('Database connected');
    } catch (err) {
        console.error('Database connection failed', err);
    }
};

module.exports = { connect1, connect2, sql, config1, config2};