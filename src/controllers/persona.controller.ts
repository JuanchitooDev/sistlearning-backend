import { Request, Response } from 'express'
import PersonaService from '../services/persona.service'

class PersonaController {
    async getPersonas(req: Request, res: Response) {
        const response = await PersonaService.getPersonas()
        if (response.result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
        }
    }

    async getPersonaById(req: Request, res: Response) {
        const response = await PersonaService.getPersonaById(+req.params.id)
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

    async getPersonaByIdTipoAndNumDoc(req: Request, res: Response) {
        const { idtipodoc, numdoc } = req.params
        const response = await PersonaService.getPersonaByIdTipoDocAndNumDoc(Number(idtipodoc), numdoc)
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

    async createPersona(req: Request, res: Response) {
        const response = await PersonaService.createPersona(req.body);
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

    async updatePersona(req: Request, res: Response) {
        const { id } = req.params;
        const response = await PersonaService.updatePersona(+id, req.body);
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

    async deletePersona(req: Request, res: Response) {
        const { id } = req.params;
        const response = await PersonaService.deletePersona(+id);
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

export default new PersonaController()