import { Request, Response } from 'express'
import EventoService from '../services/evento.service'

class EventoController {
    async getEventos(req: Request, res: Response) {
        const response = await EventoService.getEventos()
        if (response.result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
        }
    }

    async getEventoById(req: Request, res: Response) {
        const response = await EventoService.getEventoById(+req.params.id)
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

    async createEvento(req: Request, res: Response) {
        const response = await EventoService.createEvento(req.body);
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

    async updateEvento(req: Request, res: Response) {
        const { id } = req.params;
        const response = await EventoService.updateEvento(+id, req.body);
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

    async deleteEvento(req: Request, res: Response) {
        const { id } = req.params;
        const response = await EventoService.deleteEvento(+id);
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

export default new EventoController()