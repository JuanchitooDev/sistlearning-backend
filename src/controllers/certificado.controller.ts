import { Request, Response } from 'express'
import CertificadoService from '../services/certificado.service'
import AlumnoService from '../services/alumno.service'
import { ICertificado } from '../interfaces/certificadoInterface'
import { IAlumno } from '../interfaces/alumnoInterface'
import Temporal from '../models/temporal.models'
import { ITemporal } from '../interfaces/temporalInterface'

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

    async getCertificadoPorAlumnoPorEvento(req: Request, res: Response) {
        const { idAlumno, idEvento } = req.params

        const response = await CertificadoService.getCertificadoPorAlumnoPorEvento(+idAlumno, +idEvento)

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

    async loadData(req: Request, res: Response) {
        const payloadCertificados: {
            id_evento: number,
            id_tipodocumento: number,
            numero_documento: string,
            fecha_envio: string,
            nombre_impresion: string
        }[] = req.body

        if (!Array.isArray(payloadCertificados)) {
            res.status(400).json(
                {
                    result: false,
                    message: 'El parámetro debe ser un arreglo'
                }
            )
        }

        const resultados = []

        for (const payload of payloadCertificados) {
            const {
                id_evento,
                id_tipodocumento,
                numero_documento,
                fecha_envio,
                nombre_impresion
            } = payload

            try {
                // Obteniendo respuesta de consultar un alumno por tipo de documento y número de documento
                const responseAlumnoExiste = await AlumnoService.getAlumnoPorIdTipoDocNumDoc(id_tipodocumento, numero_documento)

                const { result, data } = responseAlumnoExiste

                // Validando si existe un alumno
                if (result && data) {

                    const alumno = responseAlumnoExiste.data as IAlumno

                    const { id, nombre_capitalized } = alumno

                    // Obteniendo respuesta de consultar un certificado por alumno y evento
                    const responseCertificadoExiste = await CertificadoService.getCertificadoPorAlumnoPorEvento(id as number, id_evento)

                    // Validando si existe certificado
                    if (!responseCertificadoExiste.result) {

                        // Creando un certificado
                        const certificado: ICertificado = {
                            id_alumno: id,
                            id_evento,
                            nombre_alumno_impresion: (nombre_impresion ? nombre_impresion : nombre_capitalized),
                            fecha_envio: new Date(fecha_envio)
                        }

                        // Obteniendo la respuesta de un nuevo certificado
                        const responseCertificadoCreate = await CertificadoService.createCertificado(certificado)

                        if (!responseCertificadoCreate.result) {
                            const dataTemporal: ITemporal = {
                                id_evento,
                                id_tipodocumento,
                                numero_documento,
                                fecha_envio,
                                tabla: "certificado"
                            }

                            await Temporal.create(dataTemporal as any)

                            resultados.push(
                                {
                                    id_evento,
                                    id_tipodocumento,
                                    numero_documento,
                                    fecha_envio,
                                    tabla: "certificado",
                                    status: "Error al crear. Insertado en temporal_certificado"
                                }
                            )
                        } else {
                            resultados.push(
                                {
                                    id_evento,
                                    id_tipodocumento,
                                    numero_documento,
                                    fecha_envio,
                                    tabla: "certificado",
                                    status: "Creado"
                                }
                            )
                        }
                    } else {
                        resultados.push(
                            {
                                id_evento,
                                id_tipodocumento,
                                numero_documento,
                                fecha_envio,
                                tabla: "certificado",
                                status: "Ya existe"
                            }
                        )
                        continue
                    }

                }
            } catch (error) {
                const dataTemporal: ITemporal = {
                    id_evento,
                    id_tipodocumento,
                    numero_documento,
                    fecha_envio,
                    tabla: "certificado"
                }

                await Temporal.create(dataTemporal as any)

                resultados.push(
                    {
                        id_evento,
                        id_tipodocumento,
                        numero_documento,
                        fecha_envio,
                        tabla: "certificado",
                        status: "Error al crear. Insertado en temporal_certificado"
                    }
                )
            }
        }
        res.status(200).json(
            {
                result: true,
                data: resultados
            }
        )
    }
}

export default new CertificadoController()