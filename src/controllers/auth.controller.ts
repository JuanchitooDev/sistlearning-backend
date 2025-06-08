import { Request, Response } from 'express';
import AuthService from '@/services/auth.service'

class AuthController {
    async login(req: Request, res: Response) {
        const response = await AuthService.login(req.body)

        const { result, data, token, message } = response

        if (result) {
            if (data) {
                const dataLogin = {
                    "result": result,
                    "token": token,
                    "usuario": data,
                    "message": message
                }
                res.status(200).json(dataLogin)
            } else {
                res.status(404).json(
                    {
                        message
                    }
                )
            }
        } else {
            if (message) {
                res.status(404).json(response)
            } else {
                res.status(500).json(response)
            }
        }
    }

    async logout(req: Request, res: Response) {
        const { id } = req.body

        const response = await AuthService.logout(id)

        const { result, error, message } = response

        if (result) {
            res.status(200).json(
                {
                    message
                }
            )
        } else {
            res.status(400).json(
                {
                    message: error || 'Error al cerrar sesión'
                }
            )
        }
    }
}

export default new AuthController()