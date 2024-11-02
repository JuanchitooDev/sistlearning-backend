import { Request, Response } from 'express'
import ProgramacionService from '../services/programacion.service'

class ProgramacionController {
    async getProgramaciones(req: Request, res: Response) {
        const response = await ProgramacionService.getProgramaciones()
        if (response.result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
            // res.status(500).json({ message: response.error || 'Error al obtener los actos médicos' });
        }
    }

    async getProgramacionById(req: Request, res: Response) {
        const response = await ProgramacionService.getProgramacionById(+req.params.id)
        if (response.result) {
            if (response.data) {
                res.status(200).json(response)
            } else {
                res.status(404).json({ message: 'Programación no encontrada' });
            }
        } else {
            res.status(500).json(response)
            // res.status(500).json({ message: response.error || 'Error al obtener el acto médico' });
        }
    }

    async createProgramacion(req: Request, res: Response) {
        const response = await ProgramacionService.createProgramacion(req.body);
        if (response.result) {
            res.status(201).json(response);
        } else {
            res.status(500).json(response);
            // res.status(500).json({ message: response.error || 'Error al crear el acto médico' });
        }
    }

    async updateProgramacion(req: Request, res: Response) {
        const { id } = req.params;
        const response = await ProgramacionService.updateProgramacion(+id, req.body);
        if (response.result) {
            res.status(200).json(response);
        } else {
            res.status(400).json(response);
            // res.status(400).json({ message: response.error || 'Acto médico no encontrado' });
        }
    }

    async deleteProgramacion(req: Request, res: Response) {
        const { id } = req.params;
        const response = await ProgramacionService.deleteProgramacion(+id);
        if (response.result) {
            res.status(200).json(response);
        } else {
            res.status(404).json(response);
            // res.status(404).json({ message: response.error || 'Acto médico no encontrado' });
        }
    }
}

export default new ProgramacionController()