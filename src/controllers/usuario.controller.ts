import { Request, Response } from "express"
import UsuarioService from "@/services/usuario.service"

class UsuarioController {
    async getUsuarios(req: Request, res: Response) {
        const response = await UsuarioService.getUsuarios()
        if (response.result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
        }
    }

    async getUsuarioPorId(req: Request, res: Response) {
        const response = await UsuarioService.getUsuarioPorId(+req.params.id)
        if (response.result) {
            res.status(200).json(response)
        } else {
            if (response.error) {
                res.status(500).json(response)
            } else {
                res.status(404).json(response)
            }
        }
    }

    async createUsuario(req: Request, res: Response) {
        const response = await UsuarioService.createUsuario(req.body);
        if (response.result) {
            res.status(201).json(response);
        } else {
            if (response.error) {
                res.status(500).json(response);
            } else {
                res.status(404).json(response);
            }
        }
    }
}

export default new UsuarioController()