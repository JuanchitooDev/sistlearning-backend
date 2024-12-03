import { Request, Response } from 'express'
import ContenidoService from '../services/contenido.service'

class ContenidoController {
    async getContenidos(req: Request, res: Response) {
        const response = await ContenidoService.getContenidos()
        if (response.result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
        }
    }

    async getContenidoById(req: Request, res: Response) {
        const response = await ContenidoService.getContenidoById(+req.params.id)
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

    async createContenido(req: Request, res: Response) {
        const response = await ContenidoService.createContenido(req.body);
        if (response.result) {
            res.status(201).json(response);
        } else {
            if (response.error) {
                res.status(500).json(response)
            } else {
                res.status(404).json(response);
            }
        }
    }

    async updateContenido(req: Request, res: Response) {
        const { id } = req.params;
        const response = await ContenidoService.updateContenido(+id, req.body);
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

    async deleteContenido(req: Request, res: Response) {
        const { id } = req.params;
        const response = await ContenidoService.deleteContenido(+id);
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

export default new ContenidoController()