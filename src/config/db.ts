import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const sequelize = new Sequelize(
    process.env.DB_NAME!,
    process.env.DB_USER!,
    process.env.DB_PASS!,
    {
        host: process.env.DB_HOST!,
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
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