import { Request, Response } from 'express'
import PersonaService from '../services/persona.service'

class PersonaController {
    async getPersonas(req: Request, res: Response) {
        const response = await PersonaService.getPersonas()

        const { result } = response

        if (result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
        }
    }

    async getPersonaPorId(req: Request, res: Response) {
        const { id } = req.params

        const response = await PersonaService.getPersonaPorId(+id)

        const { result, error } = response

        if (result) {
            res.status(200).json(response)
        } else {
            if (error) {
                res.status(500).json(response)
            } else {
                res.status(200).json(response);
            }
        }
    }

    async getPersonaPorIdTipoAndNumDoc(req: Request, res: Response) {
        const { idtipodoc, numdoc } = req.params

        const response = await PersonaService.getPersonaPorIdTipoDocAndNumDoc(Number(idtipodoc), numdoc)

        const { result, error } = response

        if (result) {
            res.status(200).json(response)
        } else {
            if (error) {
                res.status(500).json(response)
            } else {
                res.status(200).json(response);
            }
        }
    }

    async createPersona(req: Request, res: Response) {
        const response = await PersonaService.createPersona(req.body);

        const { result, error } = response

        if (result) {
            res.status(200).json(response);
        } else {
            if (error) {
                res.status(500).json(response);
            } else {
                res.status(200).json(response);
            }
        }
    }

    async updatePersona(req: Request, res: Response) {
        const { id } = req.params;

        const response = await PersonaService.updatePersona(+id, req.body);

        const { result, error } = response

        if (result) {
            res.status(200).json(response);
        } else {
            if (error) {
                res.status(500).json(response);
            } else {
                res.status(200).json(response);
            }
        }
    }

    async deletePersona(req: Request, res: Response) {
        const { id } = req.params;

        const response = await PersonaService.deletePersona(+id);

        const { result, error } = response

        if (result) {
            res.status(200).json(response);
        } else {
            if (error) {
                res.status(500).json(response);
            } else {
                res.status(200).json(response);
            }
        }
    }
}

export default new PersonaController()