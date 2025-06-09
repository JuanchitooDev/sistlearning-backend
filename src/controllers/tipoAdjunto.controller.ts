import { Request, Response } from 'express'
import TipoAdjuntoService from '../services/tipoAdjunto.service'

class TipoAdjuntoController {
    async getTipos(req: Request, res: Response) {
        const response = await TipoAdjuntoService.getTipos()

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

        const response = await TipoAdjuntoService.getTiposPorEstado(estadoParam)

        const { result, error } = response

        if (result) {
            res.status(200).json(response)
        } else {
            if (error) {
                res.status(500).json(response)
            } else {
                res.status(200).json(response)
            }
        }
    }

    async getTipoPorId(req: Request, res: Response) {
        const { id } = req.params

        const response = await TipoAdjuntoService.getTipoPorId(+id)

        const { result, error } = response

        if (result) {
            res.status(200).json(response)
        } else {
            if (error) {
                res.status(500).json(response)
            } else {
                res.status(200).json(response);
            }
        }
    }

    async createTipo(req: Request, res: Response) {
        const response = await TipoAdjuntoService.createTipo(req.body);

        const { result, error } = response

        if (result) {
            res.status(201).json(response);
        } else {
            if (error) {
                res.status(500).json(response);
            } else {
                res.status(200).json(response);
            }
        }
    }

    async updateTipo(req: Request, res: Response) {
        const { id } = req.params;

        const response = await TipoAdjuntoService.updateTipo(+id, req.body);

        const { result, error } = response

        if (result) {
            res.status(200).json(response);
        } else {
            if (error) {
                res.status(500).json(response);
            } else {
                res.status(200).json(response);
            }
        }
    }

    async updateEstado(req: Request, res: Response) {
        const { id } = req.params
        const { estado } = req.body

        if (typeof estado !== 'boolean') {
            res.status(400).json({
                result: false,
                message: 'Tipo de dato incorrecto'
            })
        }

        const response = await TipoAdjuntoService.updateEstado(+id, estado)

        const { result, error } = response

        if (result) {
            res.status(200).json(response)
        } else {
            if (error) {
                res.status(500).json(response)
            } else {
                res.status(200).json(response)
            }
        }
    }

    async deleteTipo(req: Request, res: Response) {
        const { id } = req.params;

        const response = await TipoAdjuntoService.deleteTipo(+id);

        const { result, error } = response

        if (result) {
            res.status(200).json(response);
        } else {
            if (error) {
                res.status(500).json(response);
            } else {
                res.status(200).json(response);
            }
        }
    }
}

export default new TipoAdjuntoController()