import { Request, Response } from 'express'
import CertificadoService from '../services/certificado.service'
import { ICertificado } from '../interfaces/certificadoInterface'

class CertificadoController {
    async getCertificados(req: Request, res: Response) {
        const response = await CertificadoService.getCertificados()

        const { result } = response

        if (result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
        }
    }

    async getCertificadosPorAlumno(req: Request, res: Response) {
        const { id_alumno } = req.query

        const idAlumno = id_alumno ? Number(id_alumno) : undefined

        const response = await CertificadoService.getCertificadosPorAlumno(idAlumno)

        const { result } = response

        if (result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
        }
    }

    async getCertificadoPorCodigo(req: Request, res: Response) {
        const { codigo } = req.params

        const response = await CertificadoService.getCertificadoPorCodigo(codigo)

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

    async getCertificadoPorId(req: Request, res: Response) {
        const { id } = req.params

        const response = await CertificadoService.getCertificadoPorId(+id)

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

    async downloadCertificado(req: Request, res: Response) {
        const { id } = req.params

        const response = await CertificadoService.downloadPorId(+id)

        const { result, outputPath, fileName, message } = response

        if (result) {
            const outputPathParam = outputPath as string
            const fileNameParam = fileName as string

            res.download(outputPathParam, fileNameParam, (err) => {
                if (err) {
                    console.error(err)
                }
            })
        } else {
            if (message) {
                res.status(404).send(response)
            } else {
                res.status(500).send(response)
            }
        }
    }

    async createCertificado(req: Request, res: Response) {
        try {
            const response = await CertificadoService.createCertificado(req.body)

            const { result, data, message, error } = response

            if (result) {
                const dataParam = data as ICertificado

                const { ruta, fileName } = dataParam

                const outputPathParam = ruta as string
                const fileNameParam = fileName as string
                res.download(outputPathParam, fileNameParam, (err) => {
                    if (err) {
                        console.error(err);
                    }
                });
            } else {
                if (message) {
                    res.status(404).send(message)
                } else {
                    res.status(500).send(error)
                }
            }
        } catch (error) {
            console.error('Error inesperado:', error);
            res.status(500).send(error)
        }
    }

    async updateCertificado(req: Request, res: Response) {
        const { id } = req.params;

        const response = await CertificadoService.updateCertificado(+id, req.body);

        const { result, data, message } = response

        if (result) {
            const dataParam = data as ICertificado

            const { ruta, fileName } = dataParam

            const outputPath = ruta as string

            const fileNameParam = fileName as string

            res.download(outputPath, fileNameParam, (err) => {
                if (err) {
                    console.error(err);
                }
            });
        } else {
            if (message) {
                res.status(404).send(response)
            } else {
                res.status(500).send(response)
            }
        }
    }

    async updateEstado(req: Request, res: Response) {
        const { id } = req.params
        const { estado } = req.body

        if (typeof estado !== 'boolean') {
            res.status(400).json({
                result: false,
                message: 'Tipo de dato incorrecto'
            })
        }

        const response = await CertificadoService.updateEstado(+id, estado)

        const { result, error } = response

        if (result) {
            res.status(200).json(response)
        } else {
            if (error) {
                res.status(500).json(response)
            } else {
                res.status(404).json(response)
            }
        }
    }

    async deleteCertificado(req: Request, res: Response) {
        const { id } = req.params;

        const response = await CertificadoService.deleteCertificado(+id);

        const { result, message } = response

        if (result) {
            res.status(200).json(response);
        } else {
            if (message) {
                res.status(404).send(response)
            } else {
                res.status(500).send(response)
            }
        }
    }
}

export default new CertificadoController()