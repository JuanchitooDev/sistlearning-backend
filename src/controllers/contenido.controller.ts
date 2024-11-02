import { Request, Response } from 'express'
import ContenidoService from '../services/contenido.service'

class ContenidoController {
    async getContenidos(req: Request, res: Response) {
        const response = await ContenidoService.getContenidos()
        if (response.result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
            // res.status(500).json({ message: response.error || 'Error al obtener los actos médicos' });
        }
    }

    async getContenidoById(req: Request, res: Response) {
        const response = await ContenidoService.getContenidoById(+req.params.id)
        if (response.result) {
            if (response.data) {
                res.status(200).json(response)
            } else {
                res.status(404).json({ message: 'Contenido no encontrado' });
            }
        } else {
            res.status(500).json(response)
            // res.status(500).json({ message: response.error || 'Error al obtener el acto médico' });
        }
    }

    async createContenido(req: Request, res: Response) {
        const response = await ContenidoService.createContenido(req.body);
        if (response.result) {
            res.status(201).json(response);
        } else {
            res.status(500).json(response);
            // res.status(500).json({ message: response.error || 'Error al crear el acto médico' });
        }
    }

    async updateContenido(req: Request, res: Response) {
        const { id } = req.params;
        const response = await ContenidoService.updateContenido(+id, req.body);
        if (response.result) {
            res.status(200).json(response);
        } else {
            res.status(400).json(response);
            // res.status(400).json({ message: response.error || 'Acto médico no encontrado' });
        }
    }

    async deleteContenido(req: Request, res: Response) {
        const { id } = req.params;
        const response = await ContenidoService.deleteContenido(+id);
        if (response.result) {
            res.status(200).json(response);
        } else {
            res.status(404).json(response);
            // res.status(404).json({ message: response.error || 'Acto médico no encontrado' });
        }
    }
}

export default new ContenidoController()