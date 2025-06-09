import { Request, Response } from 'express'
import EmpresaService from '../services/empresa.service'

class EmpresaController {
    async getEmpresas(req: Request, res: Response) {
        const response = await EmpresaService.getEmpresas()

        const { result } = response

        if (result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
        }
    }

    async getEmpresaById(req: Request, res: Response) {
        const { id } = req.params

        const response = await EmpresaService.getEmpresaById(+id)

        const { result, message } = response

        if (result) {
            res.status(200).json(response)
        } else {
            if (message) {
                res.status(404).json(response)
            } else {
                res.status(500).json(response)
            }
        }
    }

    async createEmpresa(req: Request, res: Response) {
        const response = await EmpresaService.createEmpresa(req.body);

        const { result, error } = response

        if (result) {
            res.status(201).json(response);
        } else {
            if (error) {
                res.status(500).json(response);
            } else {
                res.status(404).json(response);
            }
        }
    }

    async updateEmpresa(req: Request, res: Response) {
        const { id } = req.params;

        const response = await EmpresaService.updateEmpresa(+id, req.body);

        const { result, error } = response

        if (result) {
            res.status(200).json(response);
        } else {
            if (error) {
                res.status(500).json(response);
            } else {
                res.status(404).json(response);
            }
        }
    }

    async deleteEmpresa(req: Request, res: Response) {
        const { id } = req.params;

        const response = await EmpresaService.deleteEmpresa(+id);

        const { result, error } = response

        if (result) {
            res.status(200).json(response);
        } else {
            if (error) {
                res.status(500).json(response);
            } else {
                res.status(404).json(response);
            }
        }
    }
}

export default new EmpresaController()