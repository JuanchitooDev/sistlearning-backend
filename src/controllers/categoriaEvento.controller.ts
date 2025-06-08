import { Request, Response } from 'express'
import CategoriaEventoService from '@/services/categoriaEvento.service'

class CategoriaEventoController {
    async getCategorias(req: Request, res: Response) {
        const response = await CategoriaEventoService.getCategorias()

        const { result } = response

        if (result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
        }
    }

    async getCategoriasPorEstado(req: Request, res: Response) {
        const { estado } = req.params

        const estadoParam: boolean = estado === 'true'

        const response = await CategoriaEventoService.getCategoriasPorEstado(estadoParam)

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

    async getCategoriaPorId(req: Request, res: Response) {
        const { id } = req.params

        const response = await CategoriaEventoService.getCategoriaPorId(+id)

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

    async createCategoria(req: Request, res: Response) {
        const response = await CategoriaEventoService.createCategoria(req.body);

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

    async updateCategoria(req: Request, res: Response) {
        const { id } = req.params;

        const response = await CategoriaEventoService.updateCategoria(+id, req.body);

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

    async deleteCategoria(req: Request, res: Response) {
        const { id } = req.params;

        const response = await CategoriaEventoService.deleteCategoria(+id);

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

export default new CategoriaEventoController()