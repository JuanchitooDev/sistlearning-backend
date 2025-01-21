import Usuario from '../models/usuario.models'
import { IUsuario, UsuarioResponse } from '../interfaces/usuarioInterface'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import LogSesion from '../models/logSesion.models'

class AuthService {
    async register(data: IUsuario): Promise<UsuarioResponse> {
        try {
            const existingUser = await Usuario.findOne(
                {
                    where: {
                        username: data.username
                    }
                }
            )

            if (existingUser) {
                return { result: false, error: 'El usuario ya existe' }
            }

            const hashedPassword = await bcrypt.hash(data.password as string, 10)

            const newUser = await Usuario.create({
                username: data.username,
                password: hashedPassword
            })

            return { result: true, data: newUser as IUsuario }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage };
        }
    }

    async login(data: IUsuario, userAgent: string): Promise<UsuarioResponse> {
        try {
            const username = data.username as string
            const password = data.password as string

            const usuario = await Usuario.findOne({ where: { username } })

            if (!usuario) {
                return { result: false, error: 'Usuario no encontrado' }
            }

            const isMatch = await bcrypt.compare(password, usuario.password as string)

            if (!isMatch) {
                return { result: false, error: 'Credenciales inválidass' }
            }

            const token = jwt.sign(
                { id: usuario.id, username: usuario.username },
                process.env.JWT_SECRET || '',
                { expiresIn: process.env.EXPIRE_TOKEN }
            )

            // Actualizar el token y la fecha de inicio de sesión
            await usuario.update({
                token,
                fecha_sesion: new Date()
            })

            // Registrar el inicio de sesión en la bitácora
            await LogSesion.create({
                token,
                id_usuario: usuario.id,
                fecha_sesion: new Date(),
                user_agent: userAgent || 'Desconocido'
            })

            return {
                result: true,
                token,
                message: 'Inicio de sesión exitoso',
                data: usuario as IUsuario
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage };
        }
    }

    async logout(userId: number): Promise<UsuarioResponse> {
        try {
            const usuario = await Usuario.findOne(
                {
                    where: {
                        id: userId
                    }
                }
            )

            if (!usuario) {
                return { result: false, error: 'Usuario no encontrado' }
            }

            // Eliminar el token del usuario
            await usuario.update({
                token: null,
                fecha_sesion: null
            })

            return {
                result: true,
                message: 'Sesión cerrada con éxito'
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage };
        }
    }
}

export default new AuthService()