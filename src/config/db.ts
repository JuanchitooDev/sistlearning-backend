import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

// Determina el ambiente
const env = process.env.NODE_ENV || 'development'

// Carga el archivo de configuración correspondiente
dotenv.config({ path: `.env.${env}` })

const sequelize = new Sequelize(
    process.env.DB_NAME!,
    process.env.DB_USER!,
    process.env.DB_PASS!,
    {
        host: process.env.DB_HOST!,
        dialect: 'mysql',
        dialectOptions: {}
    }
)

sequelize.authenticate()
    .then(() => {
        console.log('Connection to the database has been established successfully')
    })
    .catch((err) => {
        console.log('Unable to connect to the database: ', err)
    })

export default sequelize;