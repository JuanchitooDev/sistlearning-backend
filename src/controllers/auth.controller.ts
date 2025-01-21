// src/controllers/authController.ts
import { Request, Response } from 'express';
import AuthService from '../services/auth.service';

class AuthController {
    async register(req: Request, res: Response) {
        try {
            const response = await AuthService.register(req.body)
            if (response.result) {
                res.status(201).json(response.data)
            } else {
                res.status(400).json({ message: response.error || 'Error al crear al usuario' })
            }
        } catch (error) {
            res.status(500).json({ message: error || 'Error al crear al usuario' })
        }
    }

    async login(req: Request, res: Response) {
        try {
            const response = await AuthService.login(req.body, req.body.userAgent)
            if (response.result) {
                if (response.data) {
                    const dataLogin = {
                        "token": response.token,
                        "usuario": response.data,
                        "result": response.result,
                        "message": response.message
                    }
                    res.status(200).json(dataLogin);
                } else {
                    res.status(404).json({ message: 'Usuario no encontrado' });
                }
            } else {
                res.status(400).json({ message: response.error || 'Error al obtener el usuario' });
            }
        } catch (error) {
            res.status(500).json({ message: error || 'Error al crear al usuario' })
        }
    }

    async logout(req: Request, res: Response) {
        try {
            const userId = req.body.id
            const response = await AuthService.logout(userId)
            if (response.result) {
                res.status(200).json({ message: response.message })
            } else {
                res.status(400).json({ message: response.error || 'Error al cerrar sesión' })
            }
        } catch (error) {
            res.status(500).json({ message: error || 'Error al cerrar sesión' })
        }
    }
}

export default new AuthController();
