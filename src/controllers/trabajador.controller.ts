import { Request, Response } from 'express'
import TrabajadorService from '../services/trabajador.service'

class TrabajadorController {
    async getTrabajadores(req: Request, res: Response) {
        const response = await TrabajadorService.getTrabajadores()

        const { result } = response

        if (result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
        }
    }

    async getTrabajadoresPorEstado(req: Request, res: Response) {

        const { estado } = req.params

        const estadoParam: boolean = estado === 'true'

        const response = await TrabajadorService.getTrabajadoresPorEstado(estadoParam)

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

    async getTrabajadorPorId(req: Request, res: Response) {
        const { id } = req.params

        const response = await TrabajadorService.getTrabajadorPorId(+id)

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

    async getTrabajadorPorIdTipoDocNumDoc(req: Request, res: Response) {
        const { idTipoDoc, numDoc } = req.params

        const response = await TrabajadorService.getTrabajadorPorIdTipoDocNumDoc(+idTipoDoc, numDoc)

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

    async getTrabajadorPorNumDoc(req: Request, res: Response) {
        const { numDoc } = req.params

        const response = await TrabajadorService.getTrabajadorPorNumDoc(numDoc)

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

    async createTrabajador(req: Request, res: Response) {
        const response = await TrabajadorService.createTrabajador(req.body);

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

    async updateTrabajador(req: Request, res: Response) {
        const { id } = req.params;

        const response = await TrabajadorService.updateTrabajador(+id, req.body);

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

    async updateEstado(req: Request, res: Response) {
        const { id } = req.params

        const { estado } = req.body

        if (typeof estado !== 'boolean') {
            res.status(400).json({
                result: false,
                message: 'Tipo de dato incorrecto'
            })
        }

        const response = await TrabajadorService.updateEstado(+id, estado)

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

    async deleteTrabajador(req: Request, res: Response) {
        const { id } = req.params;

        const response = await TrabajadorService.deleteTrabajador(+id);

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

export default new TrabajadorController()