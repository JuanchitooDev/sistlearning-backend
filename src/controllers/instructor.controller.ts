import { Request, Response } from 'express'
import InstructorService from '@/services/instructor.service'

class InstructorController {
    async getInstructores(req: Request, res: Response) {
        const response = await InstructorService.getInstructores()

        const { result } = response

        if (result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
        }
    }

    async getInstructoresPorEstado(req: Request, res: Response) {
        const { estado } = req.params

        const estadoParam: boolean = estado === 'true'

        const response = await InstructorService.getInstructoresPorEstado(estadoParam)

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

    async getInstructorPorId(req: Request, res: Response) {
        const { id } = req.params

        const response = await InstructorService.getInstructorPorId(+id)

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

    async getInstructorPorIdTipoDocNumDoc(req: Request, res: Response) {
        const { idTipoDoc, numDoc } = req.params

        const response = await InstructorService.getInstructorPorIdTipoDocNumDoc(+idTipoDoc, numDoc)

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

    async getInstructorPorNumDoc(req: Request, res: Response) {
        const { numDoc } = req.params

        const response = await InstructorService.getInstructorPorNumDoc(numDoc)

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

    async createInstructor(req: Request, res: Response) {
        const response = await InstructorService.createInstructor(req.body);

        const { result, error } = response

        if (result) {
            res.status(201).json(response);
        } else {
            if (error) {
                res.status(500).send(response)
            } else {
                res.status(200).send(response)
            }
        }
    }

    async updateInstructor(req: Request, res: Response) {
        const { id } = req.params;

        const response = await InstructorService.updateInstructor(+id, req.body);

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

        const response = await InstructorService.updateEstado(+id, estado)

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

    async deleteInstructor(req: Request, res: Response) {
        const { id } = req.params;

        const response = await InstructorService.deleteInstructor(+id);

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

export default new InstructorController()