import { Request, Response } from 'express'
import PaisService from '../services/pais.service'

class PaisController {
    async getPaises(req: Request, res: Response) {
        const response = await PaisService.getPaises()

        const { result } = response

        if (result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
        }
    }

    async getPaisesPorEstado(req: Request, res: Response) {
        const { estado } = req.params

        const estadoParam: boolean = estado === 'true'

        const response = await PaisService.getPaisesPorEstado(estadoParam)

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

    async getPaisPorId(req: Request, res: Response) {
        const { id } = req.params

        const response = await PaisService.getPaisPorId(+id)

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

    async createPais(req: Request, res: Response) {
        const response = await PaisService.createPais(req.body);

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

    async updatePais(req: Request, res: Response) {
        const { id } = req.params;

        const response = await PaisService.updatePais(+id, req.body);

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

        const response = await PaisService.updateEstado(+id, estado)

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

    async deletePais(req: Request, res: Response) {
        const { id } = req.params;

        const response = await PaisService.deletePais(+id);

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

export default new PaisController()