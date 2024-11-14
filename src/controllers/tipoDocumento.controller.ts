import { Request, Response } from 'express'
import TipoDocumentoService from '../services/tipoDocumento.service'

class TipoDocumentoController {
    async getTipos(req: Request, res: Response) {
        const response = await TipoDocumentoService.getTipos()
        if (response.result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
        }
    }

    async getTiposPorCategoria(req: Request, res: Response) {
        const categoria = req.params.categoria
        const response = await TipoDocumentoService.getTiposPorCategoria(categoria)
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

    async getTipoById(req: Request, res: Response) {
        const response = await TipoDocumentoService.getTipoById(+req.params.id)
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
        const response = await TipoDocumentoService.createTipo(req.body);
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
        const response = await TipoDocumentoService.updateTipo(+id, req.body);
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
        const response = await TipoDocumentoService.deleteTipo(+id);
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

export default new TipoDocumentoController()