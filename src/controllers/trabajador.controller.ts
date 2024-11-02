import { Request, Response } from 'express'
import TrabajadorService from '../services/trabajador.service'

class TrabajadorController {
    async getTrabajadores(req: Request, res: Response) {
        const response = await TrabajadorService.getTrabajadores()
        if (response.result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
            // res.status(500).json({ message: response.error || 'Error al obtener los actos médicos' });
        }
    }

    async getTrabajadorById(req: Request, res: Response) {
        const response = await TrabajadorService.getTrabajadorById(+req.params.id)
        if (response.result) {
            if (response.data) {
                res.status(200).json(response)
            } else {
                res.status(404).json({ message: 'Trabajador no encontrado' });
            }
        } else {
            res.status(500).json(response)
            // res.status(500).json({ message: response.error || 'Error al obtener el acto médico' });
        }
    }

    async createTrabajador(req: Request, res: Response) {
        const response = await TrabajadorService.createTrabajador(req.body);
        if (response.result) {
            res.status(201).json(response);
        } else {
            res.status(500).json(response);
            // res.status(500).json({ message: response.error || 'Error al crear el acto médico' });
        }
    }

    async updateTrabajador(req: Request, res: Response) {
        const { id } = req.params;
        const response = await TrabajadorService.updateTrabajador(+id, req.body);
        if (response.result) {
            res.status(200).json(response);
        } else {
            res.status(400).json(response);
            // res.status(400).json({ message: response.error || 'Acto médico no encontrado' });
        }
    }

    async deleteTrabajador(req: Request, res: Response) {
        const { id } = req.params;
        const response = await TrabajadorService.deleteTrabajador(+id);
        if (response.result) {
            res.status(200).json(response);
        } else {
            res.status(404).json(response);
            // res.status(404).json({ message: response.error || 'Acto médico no encontrado' });
        }
    }
}

export default new TrabajadorController()