import { Request, Response } from 'express'
import TipoContenidoService from '../services/tipoContenido.service'

class TipoContenidoController {
    async getTipos(req: Request, res: Response) {
        const response = await TipoContenidoService.getTipos()
        if (response.result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
            // res.status(500).json({ message: response.error || 'Error al obtener los actos médicos' });
        }
    }

    async getTipoById(req: Request, res: Response) {
        const response = await TipoContenidoService.getTipoById(+req.params.id)
        if (response.result) {
            if (response.data) {
                res.status(200).json(response)
            } else {
                res.status(404).json({ message: 'Tipo de contenido no encontrado' });
            }
        } else {
            res.status(500).json(response)
            // res.status(500).json({ message: response.error || 'Error al obtener el acto médico' });
        }
    }

    async createTipo(req: Request, res: Response) {
        const response = await TipoContenidoService.createTipo(req.body);
        if (response.result) {
            res.status(201).json(response);
        } else {
            res.status(500).json(response);
            // res.status(500).json({ message: response.error || 'Error al crear el acto médico' });
        }
    }

    async updateTipo(req: Request, res: Response) {
        const { id } = req.params;
        const response = await TipoContenidoService.updateTipo(+id, req.body);
        if (response.result) {
            res.status(200).json(response);
        } else {
            res.status(400).json(response);
            // res.status(400).json({ message: response.error || 'Acto médico no encontrado' });
        }
    }

    async deleteTipo(req: Request, res: Response) {
        const { id } = req.params;
        const response = await TipoContenidoService.deleteTipo(+id);
        if (response.result) {
            res.status(200).json(response);
        } else {
            res.status(404).json(response);
            // res.status(404).json({ message: response.error || 'Acto médico no encontrado' });
        }
    }
}

export default new TipoContenidoController()