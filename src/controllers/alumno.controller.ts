import { Request, Response } from 'express'
import AlumnoService from '../services/alumno.service'

class AlumnoController {
    async getAlumnos(req: Request, res: Response) {
        const response = await AlumnoService.getAlumnos()
        if (response.result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
            // res.status(500).json({ message: response.error || 'Error al obtener los actos médicos' });
        }
    }

    async getAlumnoById(req: Request, res: Response) {
        const response = await AlumnoService.getAlumnoById(+req.params.id)
        if (response.result) {
            if (response.data) {
                res.status(200).json(response)
            } else {
                res.status(404).json({ message: 'Acto médico no encontrado' });
            }
        } else {
            res.status(500).json(response)
            // res.status(500).json({ message: response.error || 'Error al obtener el acto médico' });
        }
    }

    async createAlumno(req: Request, res: Response) {
        const response = await AlumnoService.createAlumno(req.body);
        if (response.result) {
            res.status(201).json(response);
        } else {
            res.status(500).json(response);
            // res.status(500).json({ message: response.error || 'Error al crear el acto médico' });
        }
    }

    async updateAlumno(req: Request, res: Response) {
        const { id } = req.params;
        const response = await AlumnoService.updateAlumno(+id, req.body);
        if (response.result) {
            res.status(200).json(response);
        } else {
            res.status(400).json(response);
            // res.status(400).json({ message: response.error || 'Acto médico no encontrado' });
        }
    }

    async deleteAlumno(req: Request, res: Response) {
        const { id } = req.params;
        const response = await AlumnoService.deleteAlumno(+id);
        if (response.result) {
            res.status(200).json(response);
        } else {
            res.status(404).json(response);
            // res.status(404).json({ message: response.error || 'Acto médico no encontrado' });
        }
    }
}

export default new AlumnoController()