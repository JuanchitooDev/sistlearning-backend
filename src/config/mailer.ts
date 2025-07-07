import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import path from 'path'

// Determina el entorno
const env = process.env.NODE_ENV || 'development'
console.log('env', env)

// Carga el archivo .env correspondiente
const envFilePath = path.resolve(process.cwd(), `.env.${env}`)
dotenv.config({ path: envFilePath })

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER_GMAIL,
        pass: process.env.EMAIL_PASS_GMAIL
    }
})

export default transporter
// module.exports = transporter