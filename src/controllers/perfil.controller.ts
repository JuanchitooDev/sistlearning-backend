import { Request, Response } from 'express'
import PerfilService from '../services/perfil.service'

class PerfilController {
    async getPerfiles(req: Request, res: Response) {
        const response = await PerfilService.getPerfiles()
        if (response.result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
            // res.status(500).json({ message: response.error || 'Error al obtener los actos médicos' });
        }
    }

    async getPerfilById(req: Request, res: Response) {
        const response = await PerfilService.getPerfilById(+req.params.id)
        if (response.result) {
            if (response.data) {
                res.status(200).json(response)
            } else {
                res.status(404).json({ message: 'Perfil no encontrado' });
            }
        } else {
            res.status(500).json(response)
            // res.status(500).json({ message: response.error || 'Error al obtener el acto médico' });
        }
    }

    async createPerfil(req: Request, res: Response) {
        const response = await PerfilService.createPerfil(req.body);
        if (response.result) {
            res.status(201).json(response);
        } else {
            res.status(500).json(response);
            // res.status(500).json({ message: response.error || 'Error al crear el acto médico' });
        }
    }

    async updatePerfil(req: Request, res: Response) {
        const { id } = req.params;
        const response = await PerfilService.updatePerfil(+id, req.body);
        if (response.result) {
            res.status(200).json(response);
        } else {
            res.status(400).json(response);
            // res.status(400).json({ message: response.error || 'Acto médico no encontrado' });
        }
    }

    async deletePerfil(req: Request, res: Response) {
        const { id } = req.params;
        const response = await PerfilService.deletePerfil(+id);
        if (response.result) {
            res.status(200).json(response);
        } else {
            res.status(404).json(response);
            // res.status(404).json({ message: response.error || 'Acto médico no encontrado' });
        }
    }
}

export default new PerfilController()