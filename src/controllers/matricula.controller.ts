import { Request, Response } from 'express'
import MatriculaService from '../services/matricula.service'

class MatriculaController {
    async getMatriculas(req: Request, res: Response) {
        const response = await MatriculaService.getMatriculas()
        if (response.result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
            // res.status(500).json({ message: response.error || 'Error al obtener los actos médicos' });
        }
    }

    async getMatriculaById(req: Request, res: Response) {
        const response = await MatriculaService.getMatriculaById(+req.params.id)
        if (response.result) {
            if (response.data) {
                res.status(200).json(response)
            } else {
                res.status(404).json({ message: 'Matrícula no encontrada' });
            }
        } else {
            res.status(500).json(response)
            // res.status(500).json({ message: response.error || 'Error al obtener el acto médico' });
        }
    }

    async createMatricula(req: Request, res: Response) {
        const response = await MatriculaService.createMatricula(req.body);
        if (response.result) {
            res.status(201).json(response);
        } else {
            res.status(500).json(response);
            // res.status(500).json({ message: response.error || 'Error al crear el acto médico' });
        }
    }

    async updateMatricula(req: Request, res: Response) {
        const { id } = req.params;
        const response = await MatriculaService.updateMatricula(+id, req.body);
        if (response.result) {
            res.status(200).json(response);
        } else {
            res.status(400).json(response);
            // res.status(400).json({ message: response.error || 'Acto médico no encontrado' });
        }
    }

    async deleteMatricula(req: Request, res: Response) {
        const { id } = req.params;
        const response = await MatriculaService.deleteMatricula(+id);
        if (response.result) {
            res.status(200).json(response);
        } else {
            res.status(404).json(response);
            // res.status(404).json({ message: response.error || 'Acto médico no encontrado' });
        }
    }
}

export default new MatriculaController()