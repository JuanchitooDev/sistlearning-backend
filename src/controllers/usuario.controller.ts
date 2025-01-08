import { Request, Response } from 'express'
import usuarioService from '../services/usuario.service'
import { IUsuario } from '../interfaces/usuarioInterface'
import jwt from 'jsonwebtoken'

class UsuarioController {
    async createUsuario(req: Request, res: Response) {
        try {
            const { username, password } = req.body

            const usuario: IUsuario = {
                username,
                password
            }

            const response = await usuarioService.createUsuario(usuario)

            if (response.result) {
                res.status(201).json(response)
            } else {
                if (response.error) {
                    res.status(500).json(response)
                } else {
                    res.status(404).json(response)
                }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            res.status(500).json(errorMessage)
        }
    }

    async loginUsuario(req: Request, res: Response) {
        try {
            const usuario: IUsuario = {
                username: req.body.username,
                password: req.body.password
            }

            if (!req.body.username || !req.body.password) {
                res.status(400).json({ message: 'Nombre de usuario y/o contraseña son requeridas' })
            }

            const response = await usuarioService.loginUsuario(usuario)

            if (response.result) {
                const token = response.token
                res.status(200).json({
                    token,
                    message: response.message
                })
            } else {
                res.status(500).json(response)
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            res.status(500).json(errorMessage)
        }
    }

    async verifyToken(req: Request, res: Response) {
        try {
            const token = req.headers.authorization?.split(' ')[1]
            if (!token) {
                res.status(401).json({ valid: false, message: 'Token no proporcionado' })
            }

            const decoded = jwt.verify(token as string, process.env.JWT_SECRET as string)

            if (decoded) {
                res.status(200).json({ valid: true })
            } else {
                res.status(401).json({ valid: false, message: 'Token no válido' })
            }
        } catch (error) {
            res.status(401).json({ valid: false, message: 'Error al verificar el token ' })
        }
    }
}

export default new UsuarioController()