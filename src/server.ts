import app from './app'
import sequelize from './config/db'

const PORT = process.env.PORT || 3000

sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database connected')
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    })
    .catch((err) => {
        const msg = `Unable to connect to the database: ${err}`
        console.error(msg)
    })