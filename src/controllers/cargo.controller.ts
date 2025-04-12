import { Request, Response } from 'express'
import CargoService from '@/services/cargo.service'

class CargoController {
    async getCargos(req: Request, res: Response) {
        const response = await CargoService.getCargos()
        if (response.result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
        }
    }

    async getCargosPorEstado(req: Request, res: Response) {
        const estadoParam = req.params.estado
        const estado: boolean = estadoParam === 'true'
        const response = await CargoService.gerCargosPorEstado(estado)
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

    async getCargoPorId(req: Request, res: Response) {
        const response = await CargoService.getCargoPorId(+req.params.id)
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

    async createCargo(req: Request, res: Response) {
        const response = await CargoService.createCargo(req.body);
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

    async updateCargo(req: Request, res: Response) {
        const { id } = req.params;
        const response = await CargoService.updateCargo(+id, req.body);
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

    async deleteCargo(req: Request, res: Response) {
        const { id } = req.params;
        const response = await CargoService.deleteCargo(+id);
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

export default new CargoController()