import Usuario from '../models/usuario.models'
import { IUsuario, UsuarioResponse } from '../interfaces/usuarioInterface'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

class AuthService {
    async register(data: IUsuario) {
        const username = String(data.username)
        const password = String(data.password)
    
        const hashedPassword = await bcrypt.hash(String(password), 10)
    
        try {
            const user = await Usuario.create({ username, password: hashedPassword })
            return { result: true, data: user }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage };
        }
    }
    
    async login(data: IUsuario) {
        const username = String(data.username)
        const password = String(data.password)
    
        const usuario = await Usuario.findOne({ where: { username } })
    
        if (!usuario || !(await bcrypt.compare(password, String(usuario.password)))) {
            return { result: false, error: 'Credenciales inválidas' }
        }
    
        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET || '', { expiresIn: '1h' })
        return { result: true, data: token }
    }
}

export default new AuthService()