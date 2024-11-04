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
            // res.status(500).json({ message: response.error || 'Error al obtener los actos médicos' });
        }
    }

    async getCertificadoById(req: Request, res: Response) {
        const response = await CertificadoService.getCertificadoById(+req.params.id)
        if (response.result) {
            if (response.data) {
                res.status(200).json(response)
            } else {
                res.status(404).json({ message: 'Certificado no encontrado' });
            }
        } else {
            res.status(500).json(response)
            // res.status(500).json({ message: response.error || 'Error al obtener el acto médico' });
        }
    }

    async getCertificadoByCodigo(req: Request, res: Response) {
        const response = await CertificadoService.getCertificadoByCodigo(req.params.codigo)
        if (response.result) {
            if (response.data) {
                res.status(200).json(response)
            } else {
                res.status(404).json({ message: 'Certificado no encontrado' });
            }
        } else {
            res.status(500).json(response)
            // res.status(500).json({ message: response.error || 'Error al obtener el acto médico' });
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
            res.status(404).send(response.message)
        }
    }

    async createCertificado(req: Request, res: Response) {
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
        } else {
            res.status(400).json({ message: response.error })
        }
    }

    async updateCertificado(req: Request, res: Response) {
        const { id } = req.params;
        const response = await CertificadoService.updateCertificado(+id, req.body);
        if (response.result) {
            res.status(200).json(response);
        } else {
            res.status(400).json(response);
            // res.status(400).json({ message: response.error || 'Acto médico no encontrado' });
        }
    }

    async deleteCertificado(req: Request, res: Response) {
        const { id } = req.params;
        const response = await CertificadoService.deleteCertificado(+id);
        if (response.result) {
            res.status(200).json(response);
        } else {
            res.status(404).json(response);
            // res.status(404).json({ message: response.error || 'Acto médico no encontrado' });
        }
    }
}

export default new CertificadoController()