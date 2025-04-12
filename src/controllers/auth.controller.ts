import { Request, Response } from 'express';
import AuthService from '@/services/auth.service'

class AuthController {
    async login(req: Request, res: Response) {
        const response = await AuthService.login(req.body, req.body.userAgent)
        if (response.result) {
            if (response.data) {
                const dataLogin = {
                    "result": response.result,
                    "token": response.token,
                    "usuario": response.data,
                    "message": response.message
                }
                res.status(200).json(dataLogin)
            } else {
                res.status(404).json(
                    {
                        message: "Usuario no encontrado"
                    }
                )
            }
        } else {
            if (response.message) {
                res.status(404).json(response)
            } else {
                res.status(500).json(response)
            }
        }
    }

    async logout(req: Request, res: Response) {
        const response = await AuthService.logout(req.body.id)
        if (response.result) {
            res.status(200).json(
                {
                    message: response.message
                }
            )
        } else {
            res.status(400).json(
                {
                    message: response.error || 'Error al cerrar sesión'
                }
            )
        }
    }
}

export default new AuthController()