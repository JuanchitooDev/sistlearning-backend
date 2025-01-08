import { IUsuario, UsuarioResponse } from '../interfaces/usuarioInterface'
import Usuario from '../models/usuario.models'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

class UsuarioService {
    async createUsuario(data: IUsuario): Promise<UsuarioResponse> {
        try {
            dotenv.config()

            const { JWT_SECRET } = process.env

            console.log('JWT_SECRET', JWT_SECRET)

            const existeUsuario = await Usuario.findOne({
                where: {
                    username: data.username
                }
            })

            console.log('existeUsuario', existeUsuario)

            if (existeUsuario) {
                return { result: false, message: 'El usuario ya existe' }
            }

            if (!JWT_SECRET) {
                return { result: false, message: 'JWT_SECRET no está definida en las variables de entorno' }
            }

            const hashedPassword = await bcrypt.hash(data.password as string, 10)

            data.password = hashedPassword

            const newUsuario = await Usuario.create(data as any)

            const tokenInfo = {
                id: newUsuario.id,
                username: newUsuario.username
            }

            const token = jwt.sign(tokenInfo, JWT_SECRET, {
                expiresIn: process.env.EXPIRE_TOKEN
            })

            if (newUsuario.id && token) {
                return { result: true, message: 'Usuario registrado correctamente', token }
            } else {
                return { result: false, message: 'Error al regisytrar al usuario' }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async loginUsuario(data: IUsuario) {
        try {
            dotenv.config()

            const { JWT_SECRET } = process.env

            const existeUsuario = await Usuario.findOne({
                where: {
                    username: data.username
                }
            })

            if (!existeUsuario) {
                return { result: false, message: 'Usuario no encontrado' }
            }

            if (!JWT_SECRET) {
                return { result: false, message: 'JWT_SECRET no está definida en las variables de entorno' }
            }

            const loginUser: IUsuario = existeUsuario.toJSON() as IUsuario

            const isPasswordValid = await bcrypt.compare(data.password as string, loginUser.password as string)

            if (!isPasswordValid) {
                return { result: false, message: 'Contraseña incorrecta' }
            }

            const tokenInfo = {
                id: loginUser.id,
                username: loginUser.username
            }

            const token = jwt.sign(tokenInfo, JWT_SECRET, { expiresIn: process.env.EXPIRE_TOKEN })

            if (token) {
                return { result: true, message: 'Usuario autenticado correctamente', token }
            } else {
                return { result: false, message: 'Error al iniciar sesión de usuario' }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }
}

export default new UsuarioService()