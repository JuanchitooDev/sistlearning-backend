import { Request, Response } from 'express'
import CertificadoService from '../services/certificado.service'
import { ICertificado } from '../interfaces/certificadoInterface'

class CertificadoController {
    async getCertificados(req: Request, res: Response) {
        const response = await CertificadoService.getCertificados()
        if (response.result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
        }
    }

    async getCertificadoById(req: Request, res: Response) {
        const response = await CertificadoService.getCertificadoById(+req.params.id)
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

    async getCertificadoByCodigo(req: Request, res: Response) {
        const response = await CertificadoService.getCertificadoByCodigo(req.params.codigo)
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

    async downloadCertificado(req: Request, res: Response) {
        const { id } = req.params
        const response = await CertificadoService.downloadCertificado(+id)

        if (response.result) {
            const outputPath = response.outputPath as string
            const fileName = response.fileName as string

            res.download(outputPath, fileName, (err) => {
                if (err) {
                    console.error(err)
                }
            })
        } else {
            if (response.message) {
                res.status(404).send(response)
            } else {
                res.status(500).send(response)
            }
        }
    }

    async createCertificado(req: Request, res: Response) {
        try {
            const response = await CertificadoService.createCertificado(req.body)
            if (response.result) {
                const data = response.data as ICertificado
                const outputPath = data.ruta as string
                const fileName = data.fileName as string
                res.download(outputPath, fileName, (err) => {
                    if (err) {
                        console.error(err);
                    }
                });
            res.status(201).json(response);
            } else {
                if (response.message) {
                    res.status(404).send(response.message)
                } else {
                    res.status(500).send(response.error)
                }
            }
        } catch (error) {
            // return res.status(500).json({ message: 'Error inesperado en el servidor' });
            console.error('Error inesperado:', error);
            res.status(500).send(error)
        }
    }

    async updateCertificado(req: Request, res: Response) {
        const { id } = req.params;
        const response = await CertificadoService.updateCertificado(+id, req.body);
        if (response.result) {
            const data = response.data as ICertificado
            const outputPath = data.ruta as string
            const fileName = data.fileName as string
            res.download(outputPath, fileName, (err) => {
                if (err) {
                    console.error(err);
                }
            });
        } else {
            if (response.message) {
                res.status(404).send(response)
            } else {
                res.status(500).send(response)
            }
        }
    }

    async deleteCertificado(req: Request, res: Response) {
        const { id } = req.params;
        const response = await CertificadoService.deleteCertificado(+id);
        if (response.result) {
            res.status(200).json(response);
        } else {
            if (response.message) {
                res.status(404).send(response)
            } else {
                res.status(500).send(response)
            }
        }
    }
}

export default new CertificadoController()