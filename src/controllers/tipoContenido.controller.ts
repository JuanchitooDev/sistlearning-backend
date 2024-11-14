import { Request, Response } from 'express'
import TipoContenidoService from '../services/tipoContenido.service'

class TipoContenidoController {
    async getTipos(req: Request, res: Response) {
        const response = await TipoContenidoService.getTipos()
        if (response.result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
        }
    }

    async getTipoById(req: Request, res: Response) {
        const response = await TipoContenidoService.getTipoById(+req.params.id)
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

    async createTipo(req: Request, res: Response) {
        const response = await TipoContenidoService.createTipo(req.body);
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

    async updateTipo(req: Request, res: Response) {
        const { id } = req.params;
        const response = await TipoContenidoService.updateTipo(+id, req.body);
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

    async deleteTipo(req: Request, res: Response) {
        const { id } = req.params;
        const response = await TipoContenidoService.deleteTipo(+id);
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

export default new TipoContenidoController()