import { Request, Response } from 'express'
import AlumnoService from '../services/alumno.service'

class AlumnoController {
    async getAlumnos(req: Request, res: Response) {
        const response = await AlumnoService.getAlumnos()
        if (response.result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
        }
    }

    async getAlumnoById(req: Request, res: Response) {
        const response = await AlumnoService.getAlumnoById(+req.params.id)
        if (response.result) {
            res.status(200).json(response)
        } else {
            if (response.message) {
                res.status(404).json(response)
            } else {
                res.status(500).json(response)
            }
        }
    }

    async createAlumno(req: Request, res: Response) {
        const response = await AlumnoService.createAlumno(req.body);
        if (response.result) {
            res.status(200).json(response);
        } else {
            if (response.message) {
                res.status(404).send(response)
            } else {
                res.status(500).send(response)
            }
        }
    }

    async updateAlumno(req: Request, res: Response) {
        const { id } = req.params;
        const response = await AlumnoService.updateAlumno(+id, req.body);
        if (response.result) {
            res.status(200).json(response);
        } else {
            if (response.message) {
                res.status(404).send(response)
            } else {
                res.status(500).send(response)
            }
        }
    }

    async deleteAlumno(req: Request, res: Response) {
        const { id } = req.params;
        const response = await AlumnoService.deleteAlumno(+id);
        if (response.result) {
            res.status(200).json(response);
        } else {
            if (response.message) {
                res.status(404).send(response)
            } else {
                res.status(500).send(response)
            }
        }
    }
}

export default new AlumnoController()