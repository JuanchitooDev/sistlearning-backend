import { Request, Response } from 'express'
import TrabajadorService from '../services/trabajador.service'

class TrabajadorController {
    async getTrabajadores(req: Request, res: Response) {
        const response = await TrabajadorService.getTrabajadores()
        if (response.result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
        }
    }

    async getTrabajadorById(req: Request, res: Response) {
        const response = await TrabajadorService.getTrabajadorById(+req.params.id)
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

    async createTrabajador(req: Request, res: Response) {
        const response = await TrabajadorService.createTrabajador(req.body);
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

    async updateTrabajador(req: Request, res: Response) {
        const { id } = req.params;
        const response = await TrabajadorService.updateTrabajador(+id, req.body);
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

    async deleteTrabajador(req: Request, res: Response) {
        const { id } = req.params;
        const response = await TrabajadorService.deleteTrabajador(+id);
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

export default new TrabajadorController()