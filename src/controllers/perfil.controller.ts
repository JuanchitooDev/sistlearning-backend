import { Request, Response } from 'express'
import PerfilService from '@/services/perfil.service'

class PerfilController {
    async getPerfiles(req: Request, res: Response) {
        const response = await PerfilService.getPerfiles()
        if (response.result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
        }
    }

    async getPerfilesPorEstado(req: Request, res: Response) {
        const estadoParam = req.params.estado
        const estado: boolean = estadoParam === 'true'
        const response = await PerfilService.getPerfilesPorEstado(estado)
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

    async getPerfilPorId(req: Request, res: Response) {
        const response = await PerfilService.getPerfilPorId(+req.params.id)
        if (response.result) {
            res.status(200).json(response)
        } else {
            if (response.error) {
                res.status(500).json(response)
            } else {
                res.status(404).json(response);
            }
        }
    }

    async createPerfil(req: Request, res: Response) {
        const response = await PerfilService.createPerfil(req.body);
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

    async updatePerfil(req: Request, res: Response) {
        const { id } = req.params;
        const response = await PerfilService.updatePerfil(+id, req.body);
        if (response.result) {
            res.status(200).json(response);
        } else {
            if (response.error) {
                res.status(500).json(response);
            } else {
                res.status(404).json(response);
            }
        }
    }

    async deletePerfil(req: Request, res: Response) {
        const { id } = req.params;
        const response = await PerfilService.deletePerfil(+id);
        if (response.result) {
            res.status(200).json(response);
        } else {
            if (response.error) {
                res.status(500).json(response);
            } else {
                res.status(404).json(response);
            }
        }
    }
}

export default new PerfilController()