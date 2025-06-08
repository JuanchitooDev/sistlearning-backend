const path = require('path')
const dotEnvPath = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || 'development'}`)
require('dotenv').config({ path: dotEnvPath })

module.exports = {
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT || 'mysql'
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT || 'mysql'
    }
}