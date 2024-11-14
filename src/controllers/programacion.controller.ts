import { Request, Response } from 'express'
import ProgramacionService from '../services/programacion.service'

class ProgramacionController {
    async getProgramaciones(req: Request, res: Response) {
        const response = await ProgramacionService.getProgramaciones()
        if (response.result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
        }
    }

    async getProgramacionById(req: Request, res: Response) {
        const response = await ProgramacionService.getProgramacionById(+req.params.id)
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

    async createProgramacion(req: Request, res: Response) {
        const response = await ProgramacionService.createProgramacion(req.body);
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

    async updateProgramacion(req: Request, res: Response) {
        const { id } = req.params;
        const response = await ProgramacionService.updateProgramacion(+id, req.body);
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

    async deleteProgramacion(req: Request, res: Response) {
        const { id } = req.params;
        const response = await ProgramacionService.deleteProgramacion(+id);
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

export default new ProgramacionController()