import { Request, Response } from 'express'
import GrupoAdjuntoService from '@/services/grupoAdjunto.service'

class GrupoAdjuntoController {
    async getGrupos(req: Request, res: Response) {
        const response = await GrupoAdjuntoService.getGrupos()

        const { result } = response

        if (result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
        }
    }

    async getGruposPorEstado(req: Request, res: Response) {
        const { estado } = req.params

        const estadoParam: boolean = estado === 'true'

        const response = await GrupoAdjuntoService.getGruposPorEstado(estadoParam)

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

    async getGrupoPorId(req: Request, res: Response) {
        const { id } = req.params

        const response = await GrupoAdjuntoService.getGrupoPorId(+id)

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

    async createGrupo(req: Request, res: Response) {
        const response = await GrupoAdjuntoService.createGrupo(req.body);

        const { result, error } = response

        if (result) {
            res.status(201).json(response);
        } else {
            if (error) {
                res.status(500).json(response);
            } else {
                res.status(200).json(response);
            }
        }
    }

    async updateGrupo(req: Request, res: Response) {
        const { id } = req.params;

        const response = await GrupoAdjuntoService.updateGrupo(+id, req.body);

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

    async updateEstado(req: Request, res: Response) {
        const { id } = req.params;

        const response = await GrupoAdjuntoService.updateEstado(+id, req.body);

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

    async deleteGrupo(req: Request, res: Response) {
        const { id } = req.params;

        const response = await GrupoAdjuntoService.deleteGrupo(+id);

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

export default new GrupoAdjuntoController()