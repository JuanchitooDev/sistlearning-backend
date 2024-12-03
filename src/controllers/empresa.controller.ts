import { Request, Response } from 'express'
import EmpresaService from '../services/empresa.service'

class EmpresaController {
    async getEmpresas(req: Request, res: Response) {
        const response = await EmpresaService.getEmpresas()
        if (response.result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
        }
    }

    async getEmpresaById(req: Request, res: Response) {
        const response = await EmpresaService.getEmpresaById(+req.params.id)
        if (response.result) {
            res.status(200).json(response)
        } else {
            if (response.message) {
                res.status(404).json(response)
            } else {
                res.status(500).json(response)
            }
        }
    }

    async createEmpresa(req: Request, res: Response) {
        const response = await EmpresaService.createEmpresa(req.body);
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

    async updateEmpresa(req: Request, res: Response) {
        const { id } = req.params;
        const response = await EmpresaService.updateEmpresa(+id, req.body);
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

    async deleteEmpresa(req: Request, res: Response) {
        const { id } = req.params;
        const response = await EmpresaService.deleteEmpresa(+id);
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

export default new EmpresaController()