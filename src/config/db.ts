import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
import path from 'path'

// Determina el entorno (development por defecto)
const env = process.env.NODE_ENV || 'development'

// Carga el archivo .env correspondiente
const envFilePath = path.resolve(process.cwd(), `.env.${env}`)
dotenv.config({ path: envFilePath })

// Determina el ambiente
// const env = process.env.NODE_ENV || 'development'
// const env = 'development'
// Carga el archivo de configuración correspondiente
// dotenv.config({ path: `.env.${env}` })

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
        console.log('Conexión a la base de datos fue establecida con éxito')
    })
    .catch((err) => {
        console.log('No se pudo conectar a la base de datos: ', err)
    })

export default sequelize;