import { Request, Response } from 'express'
import PersonaService from '../services/persona.service'

class PersonaController {
    async getPersonas(req: Request, res: Response) {
        const response = await PersonaService.getPersonas()
        if (response.result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
            // res.status(500).json({ message: response.error || 'Error al obtener los actos médicos' });
        }
    }

    async getPersonaById(req: Request, res: Response) {
        const response = await PersonaService.getPersonaById(+req.params.id)
        if (response.result) {
            if (response.data) {
                res.status(200).json(response)
            } else {
                res.status(404).json({ message: 'Persona no encontrada' });
            }
        } else {
            res.status(500).json(response)
            // res.status(500).json({ message: response.error || 'Error al obtener el acto médico' });
        }
    }

    async getPersonaByIdTipoAndNumDoc(req: Request, res: Response) {
        const { idtipodoc, numdoc } = req.params
        const response = await PersonaService.getPersonaByIdTipoDocAndNumDoc(Number(idtipodoc), numdoc)
        if (response.result) {
            if (response.data) {
                res.status(200).json(response)
            } else {
                res.status(404).json({ message: 'Persona no encontrada' });
            }
        } else {
            res.status(404).json({ result: response.result, message: response.message })
            // res.status(500).json(response)
            // res.status(500).json({ message: response.error || 'Error al obtener el acto médico' });
        }
    }

    async createPersona(req: Request, res: Response) {
        const response = await PersonaService.createPersona(req.body);
        if (response.result) {
            res.status(201).json(response);
        } else {
            res.status(500).json(response);
            // res.status(500).json({ message: response.error || 'Error al crear el acto médico' });
        }
    }

    async updatePersona(req: Request, res: Response) {
        const { id } = req.params;
        const response = await PersonaService.updatePersona(+id, req.body);
        if (response.result) {
            res.status(200).json(response);
        } else {
            res.status(400).json(response);
            // res.status(400).json({ message: response.error || 'Acto médico no encontrado' });
        }
    }

    async deletePersona(req: Request, res: Response) {
        const { id } = req.params;
        const response = await PersonaService.deletePersona(+id);
        if (response.result) {
            res.status(200).json(response);
        } else {
            res.status(404).json(response);
            // res.status(404).json({ message: response.error || 'Acto médico no encontrado' });
        }
    }
}

export default new PersonaController()