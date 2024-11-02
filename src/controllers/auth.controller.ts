// src/controllers/authController.ts
import { Request, Response } from 'express';
import AuthService from '../services/auth.service';

class AuthController {
    async register(req: Request, res: Response) {
        try {
            // const user = await AuthService.register(req.body);
            // res.status(201).json(user);
            const response = await AuthService.register(req.body)
            if (response.result) {
                res.status(201).json(response.data)
            } else {
                res.status(500).json({ message: response.error || 'Error al crear al usuario' })
            }
        } catch (error) {
            // res.status(400).json({ error: error.message });
            res.status(500).json({ message: error || 'Error al crear al usuario' })
        }
    }

    async login(req: Request, res: Response) {
        try {
            // const { token } = await AuthService.login(req.body);
            // res.status(200).json({ token });
            const response = await AuthService.login(req.body)
            if (response.result) {
                if (response.data) {
                    res.status(200).json(response.data);
                } else {
                    res.status(404).json({ message: 'Usuario no encontrado' });
                }
            } else {
                res.status(500).json({ message: response.error || 'Error al obtener el usuario' });
            }
        } catch (error) {
            // res.status(400).json({ error: error.message });
            res.status(500).json({ message: error || 'Error al crear al usuario' })
        }
    }
}

export default new AuthController();
