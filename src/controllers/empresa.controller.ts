import { Request, Response } from 'express'
import EmpresaService from '../services/empresa.service'

class EmpresaController {
    async getEmpresas(req: Request, res: Response) {
        const response = await EmpresaService.getEmpresas()
        if (response.result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
            // res.status(500).json({ message: response.error || 'Error al obtener los actos médicos' });
        }
    }

    async getEmpresaById(req: Request, res: Response) {
        const response = await EmpresaService.getEmpresaById(+req.params.id)
        if (response.result) {
            if (response.data) {
                res.status(200).json(response)
            } else {
                res.status(404).json({ message: 'Empresa no encontrada' });
            }
        } else {
            res.status(500).json(response)
            // res.status(500).json({ message: response.error || 'Error al obtener el acto médico' });
        }
    }

    async createEmpresa(req: Request, res: Response) {
        const response = await EmpresaService.createEmpresa(req.body);
        if (response.result) {
            res.status(201).json(response);
        } else {
            res.status(500).json(response);
            // res.status(500).json({ message: response.error || 'Error al crear el acto médico' });
        }
    }

    async updateEmpresa(req: Request, res: Response) {
        const { id } = req.params;
        const response = await EmpresaService.updateEmpresa(+id, req.body);
        if (response.result) {
            res.status(200).json(response);
        } else {
            res.status(400).json(response);
            // res.status(400).json({ message: response.error || 'Acto médico no encontrado' });
        }
    }

    async deleteEmpresa(req: Request, res: Response) {
        const { id } = req.params;
        const response = await EmpresaService.deleteEmpresa(+id);
        if (response.result) {
            res.status(200).json(response);
        } else {
            res.status(404).json(response);
            // res.status(404).json({ message: response.error || 'Acto médico no encontrado' });
        }
    }
}

export default new EmpresaController()