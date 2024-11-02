import { Request, Response } from 'express'
import TipoDocumentoService from '../services/tipoDocumento.service'

class TipoDocumentoController {
    async getTipos(req: Request, res: Response) {
        const response = await TipoDocumentoService.getTipos()
        if (response.result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
            // res.status(500).json({ message: response.error || 'Error al obtener los actos médicos' });
        }
    }

    async getTiposPorCategoria(req: Request, res: Response) {
        const categoria = req.params.categoria
        const response = await TipoDocumentoService.getTiposPorCategoria(categoria)
        if (response.result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
            // res.status(500).json({ message: response.error || 'Error al obtener los actos médicos' });
        }
    }

    async getTipoById(req: Request, res: Response) {
        const response = await TipoDocumentoService.getTipoById(+req.params.id)
        if (response.result) {
            if (response.data) {
                res.status(200).json(response)
            } else {
                res.status(404).json({ message: 'Tipo de documento no encontrado' });
            }
        } else {
            res.status(500).json(response)
            // res.status(500).json({ message: response.error || 'Error al obtener el acto médico' });
        }
    }

    async createTipo(req: Request, res: Response) {
        const response = await TipoDocumentoService.createTipo(req.body);
        if (response.result) {
            res.status(201).json(response);
        } else {
            res.status(500).json(response);
            // res.status(500).json({ message: response.error || 'Error al crear el acto médico' });
        }
    }

    async updateTipo(req: Request, res: Response) {
        const { id } = req.params;
        const response = await TipoDocumentoService.updateTipo(+id, req.body);
        if (response.result) {
            res.status(200).json(response);
        } else {
            res.status(400).json(response);
            // res.status(400).json({ message: response.error || 'Acto médico no encontrado' });
        }
    }

    async deleteTipo(req: Request, res: Response) {
        const { id } = req.params;
        const response = await TipoDocumentoService.deleteTipo(+id);
        if (response.result) {
            res.status(200).json(response);
        } else {
            res.status(404).json(response);
            // res.status(404).json({ message: response.error || 'Acto médico no encontrado' });
        }
    }
}

export default new TipoDocumentoController()