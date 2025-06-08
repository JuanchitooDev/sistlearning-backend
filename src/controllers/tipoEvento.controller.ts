import { Request, Response } from 'express'
import TipoEventoService from '@/services/tipoEvento.service'

class TipoEventoController {
    async getTipos(req: Request, res: Response) {
        const response = await TipoEventoService.getTipos()

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

        const response = await TipoEventoService.getTiposPorEstado(estadoParam)

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

        const response = await TipoEventoService.getTipoPorId(+id)

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

    async getTipoPorNombre(req: Request, res: Response) {
        const { nombre } = req.params

        const response = await TipoEventoService.getTipoPorNombre(nombre)
        console.log('response getTipoPorNombre', response)

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
        // if (response.result) {
        //     res.status(200).json(response)
        // } else {
        //     res.status(500).json(response)
        // }
    }

    async createTipo(req: Request, res: Response) {
        const response = await TipoEventoService.createTipo(req.body);

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

        const response = await TipoEventoService.updateTipo(+id, req.body);

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

        const response = await TipoEventoService.updateEstado(+id, estado)

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

        const response = await TipoEventoService.deleteTipo(+id);

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

export default new TipoEventoController()