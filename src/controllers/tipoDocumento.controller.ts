import { Request, Response } from 'express'
import TipoDocumentoService from '@/services/tipoDocumento.service'

class TipoDocumentoController {
    async getTipos(req: Request, res: Response) {
        const response = await TipoDocumentoService.getTipos()

        const { result } = response

        if (result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
        }
    }

    async getTiposPorEstado(req: Request, res: Response) {
        const { estado } = req.params

        const estadoParam: boolean = estado === 'true'

        const response = await TipoDocumentoService.getTiposPorEstado(estadoParam)

        const { result, error } = response

        if (result) {
            res.status(200).json(response)
        } else {
            if (error) {
                res.status(500).json(response)
            } else {
                res.status(404).json(response)
            }
        }
    }

    async getTiposPorCategoria(req: Request, res: Response) {
        const { categoria } = req.params

        const response = await TipoDocumentoService.getTiposPorCategoria(categoria)

        const { result, error } = response

        if (result) {
            res.status(200).json(response)
        } else {
            if (error) {
                res.status(500).json(response)
            } else {
                res.status(404).json(response);
            }
        }
    }

    async getTipoPorId(req: Request, res: Response) {
        const { id } = req.params

        const response = await TipoDocumentoService.getTipoPorId(+id)

        const { result, error } = response

        if (result) {
            res.status(200).json(response)
        } else {
            if (error) {
                res.status(500).json(response)
            } else {
                res.status(404).json(response);
            }
        }
    }

    async createTipo(req: Request, res: Response) {
        const response = await TipoDocumentoService.createTipo(req.body);

        const { result, error } = response

        if (result) {
            res.status(201).json(response);
        } else {
            if (error) {
                res.status(500).json(response);
            } else {
                res.status(404).json(response);
            }
        }
    }

    async updateTipo(req: Request, res: Response) {
        const { id } = req.params;

        const response = await TipoDocumentoService.updateTipo(+id, req.body);

        const { result, error } = response

        if (result) {
            res.status(200).json(response);
        } else {
            if (error) {
                res.status(500).json(response);
            } else {
                res.status(404).json(response);
            }
        }
    }

    async deleteTipo(req: Request, res: Response) {
        const { id } = req.params;

        const response = await TipoDocumentoService.deleteTipo(+id);

        const { result, error } = response

        if (result) {
            res.status(200).json(response);
        } else {
            if (error) {
                res.status(500).json(response);
            } else {
                res.status(404).json(response);
            }
        }
    }
}

export default new TipoDocumentoController()