import { Request, Response } from 'express'
import AlumnoService from '../services/alumno.service'

class AlumnoController {
    async getAlumnos(req: Request, res: Response) {
        const response = await AlumnoService.getAlumnos()

        const { result } = response

        if (result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
        }
    }

    async getAlumnosPorEstado(req: Request, res: Response) {

        const { estado } = req.params

        const estadoParam: boolean = estado === 'true'

        const response = await AlumnoService.getAlumnosPorEstado(estadoParam)

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

    async getAlumnoPorId(req: Request, res: Response) {
        const { id } = req.params

        const response = await AlumnoService.getAlumnoPorId(+id)

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

    async getAlumnoPorIdTipoDocNumDoc(req: Request, res: Response) {
        const { idTipoDoc, numDoc } = req.params

        const response = await AlumnoService.getAlumnoPorIdTipoDocNumDoc(+idTipoDoc, numDoc)

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

    async getAlumnoPorNumDoc(req: Request, res: Response) {
        const { numDoc } = req.params

        const response = await AlumnoService.getAlumnoPorNumDoc(numDoc)

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

    async createAlumno(req: Request, res: Response) {
        const response = await AlumnoService.createAlumno(req.body);

        const { result, error } = response

        if (result) {
            res.status(200).json(response);
        } else {
            if (error) {
                res.status(500).send(response)
            } else {
                res.status(200).send(response)
            }
        }
    }

    async updateAlumno(req: Request, res: Response) {
        const { id } = req.params;

        const response = await AlumnoService.updateAlumno(+id, req.body);

        const { result, error } = response

        if (result) {
            res.status(200).json(response);
        } else {
            if (error) {
                res.status(500).send(response)
            } else {
                res.status(200).send(response)
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

        const response = await AlumnoService.updateEstado(+id, estado)

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

    async deleteAlumno(req: Request, res: Response) {
        const { id } = req.params;

        const response = await AlumnoService.deleteAlumno(+id);

        const { result, error } = response

        if (result) {
            res.status(200).json(response);
        } else {
            if (error) {
                res.status(500).send(response)
            } else {
                res.status(200).send(response)
            }
        }
    }
}

export default new AlumnoController()