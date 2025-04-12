import { Request, Response } from 'express'
import MatriculaService from '@/services/matricula.service'

class MatriculaController {
    async getMatriculas(req: Request, res: Response) {
        const response = await MatriculaService.getMatriculas()
        if (response.result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
        }
    }

    async getMatriculaById(req: Request, res: Response) {
        const response = await MatriculaService.getMatriculaById(+req.params.id)
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

    async createMatricula(req: Request, res: Response) {
        const response = await MatriculaService.createMatricula(req.body);
        if (response.result) {
            res.status(201).json(response);
        } else {
            if (response.error) {
                res.status(500).json(response);
            } else {
                res.status(404).json(response);
            }
        }
    }

    async updateMatricula(req: Request, res: Response) {
        const { id } = req.params;
        const response = await MatriculaService.updateMatricula(+id, req.body);
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

    async deleteMatricula(req: Request, res: Response) {
        const { id } = req.params;
        const response = await MatriculaService.deleteMatricula(+id);
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

export default new MatriculaController()