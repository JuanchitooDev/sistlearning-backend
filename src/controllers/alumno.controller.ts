import { Request, Response } from 'express'
import AlumnoService from '../services/alumno.service'
import PersonaService from '../services/persona.service'
import { IAlumno } from '../interfaces/alumnoInterface'
import { IPersona } from '../interfaces/personaInterface'
import HString from '../helpers/HString'
import { ITemporal } from '../interfaces/temporalInterface'
import Temporal from '../models/temporal.models'

class AlumnoController {
    async getAlumnos(req: Request, res: Response) {
        const response = await AlumnoService.getAlumnos()

        const { result } = response

        if (result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
        }
    }

    async getAlumnosPorEstado(req: Request, res: Response) {

        const { estado } = req.params

        const estadoParam: boolean = estado === 'true'

        const response = await AlumnoService.getAlumnosPorEstado(estadoParam)

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

    async getAlumnoPorId(req: Request, res: Response) {
        const { id } = req.params

        const response = await AlumnoService.getAlumnoPorId(+id)

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

    async getAlumnoPorIdTipoDocNumDoc(req: Request, res: Response) {
        const { idTipoDoc, numDoc } = req.params

        const response = await AlumnoService.getAlumnoPorIdTipoDocNumDoc(+idTipoDoc, numDoc)

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

    async getAlumnoPorNumDoc(req: Request, res: Response) {
        const { numDoc } = req.params

        const response = await AlumnoService.getAlumnoPorNumDoc(numDoc)

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

    async createAlumno(req: Request, res: Response) {
        const response = await AlumnoService.createAlumno(req.body);

        const { result, error } = response

        if (result) {
            res.status(200).json(response);
        } else {
            if (error) {
                res.status(500).send(response)
            } else {
                res.status(200).send(response)
            }
        }
    }

    async updateAlumno(req: Request, res: Response) {
        const { id } = req.params;

        const response = await AlumnoService.updateAlumno(+id, req.body);

        const { result, error } = response

        if (result) {
            res.status(200).json(response);
        } else {
            if (error) {
                res.status(500).send(response)
            } else {
                res.status(200).send(response)
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

        const response = await AlumnoService.updateEstado(+id, estado)

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

    async deleteAlumno(req: Request, res: Response) {
        const { id } = req.params;

        const response = await AlumnoService.deleteAlumno(+id);

        const { result, error } = response

        if (result) {
            res.status(200).json(response);
        } else {
            if (error) {
                res.status(500).send(response)
            } else {
                res.status(200).send(response)
            }
        }
    }

    async loadData(req: Request, res: Response) {
        const documentos: {
            id_tipodocumento: number,
            numero_documento: string
        }[] = req.body

        if (!Array.isArray(documentos)) {
            res.status(400).json(
                {
                    result: false,
                    message: 'El parámetro debe ser un arreglo'
                }
            )
        }

        const resultados = []

        for (const doc of documentos) {
            const { id_tipodocumento, numero_documento } = doc

            try {
                // Obteniendo la respuesta de consultar un alumno por tipo de documento y número de documento
                const responseAlumnoExiste = await AlumnoService.getAlumnoPorIdTipoDocNumDoc(id_tipodocumento, numero_documento)

                const { result, data } = responseAlumnoExiste

                // Validando si existe un alumno
                if (result && data) {
                    resultados.push(
                        {
                            id_tipodocumento,
                            numero_documento,
                            tabla: "alumno",
                            status: "Ya existe"
                        }
                    )
                    continue
                }

                // Obteniendo la respuesta de consultar una persona por tipo de documento y número de documento
                const responsePersonaExiste = await PersonaService.getPersonaPorIdTipoDocAndNumDoc(id_tipodocumento, numero_documento)

                // Validando si existe una persona
                if (responsePersonaExiste.result && responsePersonaExiste.data) {
                    const persona: IPersona = responsePersonaExiste.data as IPersona

                    const {
                        id_tipodocumento,
                        numero,
                        apellido_paterno,
                        apellido_materno,
                        nombres,
                        fecha_nacimiento,
                        sexo
                    } = persona

                    const nombreCompleto = `${nombres} ${apellido_paterno} ${apellido_materno}`
                    const nombreCapitalized = HString.capitalizeNames(nombreCompleto)

                    const fechaNacimientoStr = fecha_nacimiento as string
                    const partsFechaNacimiento = fechaNacimientoStr.split("/")
                    const fechaNacimiento = `${partsFechaNacimiento[2]}-${partsFechaNacimiento[1]}-${partsFechaNacimiento[0]}`

                    // Creando un alumno
                    const alumno: IAlumno = {
                        id_tipodocumento,
                        numero_documento: numero,
                        apellido_paterno,
                        apellido_materno,
                        nombres: nombres,
                        nombre_capitalized: nombreCapitalized,
                        fecha_nacimiento_str: fechaNacimiento,
                        fecha_nacimiento: fechaNacimiento && !isNaN(Date.parse(fechaNacimiento))
                            ? new Date(fechaNacimiento)
                            : undefined,
                        sexo,
                        telefono: "--"
                    }

                    // Obteniendo la respuesta de un nuevo alumno
                    const responseAlumnoCreate = await AlumnoService.createAlumno(alumno)

                    // Validando respuesta del registro de un nuevo alumno
                    if (responseAlumnoCreate.result) {
                        resultados.push(
                            {
                                id_tipodocumento,
                                numero_documento,
                                tabla: "alumno",
                                status: "Creado"
                            }
                        )
                    } else {
                        const dataTemporal: ITemporal = {
                            id_tipodocumento,
                            numero_documento,
                            tabla: 'alumno',
                        }

                        await Temporal.create(dataTemporal as any)

                        resultados.push(
                            {
                                id_tipodocumento,
                                numero_documento,
                                tabla: "alumno",
                                status: "Error al crear. Insertado en temporal"
                            }
                        )
                    }
                }
            } catch (error) {
                await Temporal.create(
                    {
                        id_tipodocumento,
                        numero_documento,
                        tabla: 'alumno'
                    }
                )

                resultados.push(
                    {
                        numero_documento,
                        tabla: "alumno",
                        status: "Error inesperado. Insertado en temporal"
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

export default new AlumnoController()