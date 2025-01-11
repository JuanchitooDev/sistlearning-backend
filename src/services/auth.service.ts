import Usuario from '../models/usuario.models'
import { IUsuario, UsuarioResponse } from '../interfaces/usuarioInterface'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

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

    async login(data: IUsuario): Promise<UsuarioResponse> {
        try {
            const username = String(data.username)
            const password = String(data.password)

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

            return {
                result: true,
                token,
                data: usuario as IUsuario
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage };
        }
    }
}

export default new AuthService()