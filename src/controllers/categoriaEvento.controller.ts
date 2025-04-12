import { Request, Response } from 'express'
import CategoriaEventoService from '@/services/categoriaEvento.service'

class CategoriaEventoController {
    async getCategorias(req: Request, res: Response) {
        const response = await CategoriaEventoService.getCategorias()
        if (response.result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
        }
    }

    async getCategoriasPorEstado(req: Request, res: Response) {
        const estadoParam = req.params.estado
        const estado: boolean = estadoParam === 'true'
        const response = await CategoriaEventoService.getCategoriasPorEstado(estado)
        if (response.result) {
            res.status(200).json(response)
        } else {
            if (response.error) {
                res.status(500).json(response)
            } else {
                res.status(404).json(response)
            }
        }
    }

    async getCategoriaPorId(req: Request, res: Response) {
        const response = await CategoriaEventoService.getCategoriaPorId(+req.params.id)
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

    async createCategoria(req: Request, res: Response) {
        const response = await CategoriaEventoService.createCategoria(req.body);
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

    async updateCategoria(req: Request, res: Response) {
        const { id } = req.params;
        const response = await CategoriaEventoService.updateCategoria(+id, req.body);
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

    async deleteCategoria(req: Request, res: Response) {
        const { id } = req.params;
        const response = await CategoriaEventoService.deleteCategoria(+id);
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

export default new CategoriaEventoController()