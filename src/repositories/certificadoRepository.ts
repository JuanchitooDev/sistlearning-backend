import { CertificadoResponse, ICertificado } from "../interfaces/certificadoInterface";
import Alumno from "../models/alumno.models";
import Certificado from "../models/certificado.models";
import Evento from "../models/evento.models";
import fs from 'fs';
import AlumnoService from '../services/alumno.service';
import EventoService from '../services/evento.service';
import { IAlumno } from "../interfaces/alumnoInterface";
import { IEvento } from "../interfaces/eventoInterface";
import HString from "../helpers/HString";
import HPdf from "../helpers/HPdf"

class CertificadoRepository {
    async getAll(): Promise<CertificadoResponse> {
        try {
            const certificados = await Certificado.findAll({
                attributes: [
                    'id',
                    'id_alumno',
                    'id_evento',
                    'codigo',
                    'codigoQR',
                    'ruta',
                    'fileName',
                    'templateName',
                    'fecha_registro',
                    'fecha_descarga',
                    'fecha_envio',
                    'estado',
                    'nombre_alumno_impresion'
                ],
                include: [
                    {
                        model: Alumno,
                        attributes: [
                            'id',
                            'apellido_paterno',
                            'apellido_materno',
                            'nombres'
                        ]
                    }, {
                        model: Evento,
                        attributes: [
                            'id',
                            'titulo',
                            'fecha',
                            'fecha_fin',
                            'duracion'
                        ]
                    }
                ],
                order: [
                    ['id', 'DESC']
                ]
            })

            return { result: true, data: certificados, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getByAlumnoId(idAlumno?: number): Promise<CertificadoResponse> {
        try {
            const whereClause = idAlumno ? { id_alumno: idAlumno } : {}

            const certificados = await Certificado.findAll({
                where: whereClause,
                attributes: [
                    'id',
                    'id_alumno',
                    'id_evento',
                    'codigo',
                    'codigoQR',
                    'ruta',
                    'fileName',
                    'fecha_registro',
                    'fecha_descarga',
                    'templateName',
                    'fecha_envio',
                    'estado',
                    'nombre_alumno_impresion'
                ],
                include: [
                    {
                        model: Alumno,
                        attributes: [
                            'id',
                            'apellido_paterno',
                            'apellido_materno',
                            'nombres',
                            'nombre_capitalized'
                        ]
                    }, {
                        model: Evento,
                        attributes: [
                            'id',
                            'titulo',
                            'fecha',
                            'fecha_fin',
                            'duracion'
                        ]
                    }
                ],
                order: [
                    ['id', 'desc']
                ]
            })

            return { result: true, data: certificados, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }

    async getByCodigo(codigo: string): Promise<CertificadoResponse> {
        try {
            const certificado = await Certificado.findOne({
                where: { codigo },
                attributes: [
                    'id',
                    'id_alumno',
                    'id_evento',
                    'codigo',
                    'codigoQR',
                    'ruta',
                    'fileName',
                    'fecha_registro',
                    'fecha_descarga',
                    'templateName',
                    'fecha_envio',
                    'estado',
                    'nombre_alumno_impresion'
                ],
                include: [
                    {
                        model: Alumno,
                        attributes: [
                            'id',
                            'apellido_paterno',
                            'apellido_materno',
                            'nombres',
                            'nombre_capitalized'
                        ]
                    }, {
                        model: Evento,
                        attributes: [
                            'id',
                            'titulo',
                            'fecha',
                            'fecha_fin',
                            'duracion'
                        ]
                    }
                ]
            })

            if (!certificado) {
                return { result: false, data: [], message: 'Certificado no encontrado', status: 200 }
            }

            return { result: true, data: certificado, message: 'Certificado encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getById(id: number): Promise<CertificadoResponse> {
        try {
            const certificado = await Certificado.findByPk(id, {
                attributes: [
                    'id',
                    'id_alumno',
                    'id_evento',
                    'codigo',
                    'codigoQR',
                    'ruta',
                    'fileName',
                    'fecha_registro',
                    'fecha_descarga',
                    'templateName',
                    'fecha_envio',
                    'estado',
                    'nombre_alumno_impresion'
                ],
                include: [
                    {
                        model: Alumno,
                        attributes: [
                            'id',
                            'apellido_paterno',
                            'apellido_materno',
                            'nombres',
                            'nombre_capitalized'
                        ]
                    }, {
                        model: Evento,
                        attributes: [
                            'id',
                            'titulo',
                            'fecha',
                            'fecha_fin',
                            'duracion'
                        ]
                    }
                ]
            })

            if (!certificado) {
                return { result: false, data: [], message: 'Certificado no encontrado', status: 200 }
            }

            return { result: true, data: certificado, message: 'Certificado encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getByAlumnoIdEventoId(idAlumno: number, idEvento: number): Promise<CertificadoResponse> {
        try {
            const certificado = await Certificado.findOne({
                where: {
                    id_alumno: idAlumno,
                    id_evento: idEvento
                },
                attributes: [
                    'id',
                    'id_alumno',
                    'id_evento',
                    'codigo',
                    'codigoQR',
                    'ruta',
                    'fileName',
                    'fecha_registro',
                    'fecha_descarga',
                    'templateName',
                    'fecha_envio',
                    'estado',
                    'nombre_alumno_impresion'
                ],
                include: [
                    {
                        model: Alumno,
                        attributes: [
                            'id',
                            'apellido_paterno',
                            'apellido_materno',
                            'nombres',
                            'nombre_capitalized'
                        ]
                    }, {
                        model: Evento,
                        attributes: [
                            'id',
                            'titulo',
                            'fecha',
                            'fecha_fin',
                            'duracion'
                        ]
                    }
                ]
            })

            if (!certificado) {
                return { result: false, data: [], message: 'Certificado no encontrado', status: 200 }
            }

            return { result: true, data: certificado, message: 'Certificado encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async downloadById(id: number) {
        try {
            const response = await this.getById(id)

            const { result } = response

            if (result) {
                const certificado = response.data as ICertificado

                const { ruta, fileName } = certificado

                const path = ruta as string

                // Verificar si el archivo existe antes de descargarlo
                if (fs.existsSync(path)) {
                    const result = {
                        result: true,
                        message: 'Certificado encontrado',
                        outputPath: path,
                        fileName,
                        status: 200
                    }
                    return result
                }

                return { result: false, message: 'Certificado no encontrado', outputPath: null, fileName: null, status: 200 }
            } else {
                return { result: false, error: response.error, outputPath: null, fileName: null, status: 500 }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async create(data: ICertificado): Promise<CertificadoResponse> {
        try {
            const { id_alumno, id_evento, nombre_alumno_impresion } = data

            const idAlumno = id_alumno as number
            const idEvento = id_evento as number

            const alumnoResponse = await AlumnoService.getAlumnoPorId(idAlumno)

            const { error } = alumnoResponse

            if (!alumnoResponse.result) {
                if (error) {
                    return { result: false, error: alumnoResponse.error, status: 500 }
                }

                return { result: false, message: alumnoResponse.message, status: 200 }
            }

            const eventoResponse = await EventoService.getEventoPorId(idEvento)

            if (!eventoResponse.result) {
                if (eventoResponse.error) {
                    return { result: false, error: eventoResponse.error, status: 500 }
                }

                return { result: false, message: eventoResponse.message, status: 200 }
            }

            const alumno = alumnoResponse.data as IAlumno

            const evento = eventoResponse.data as IEvento

            const { nombre_capitalized } = alumno

            const nombreAlumnoImpresion = (nombre_alumno_impresion === undefined)
                ? `${nombre_capitalized}`
                : HString.capitalizeNames(nombre_alumno_impresion)

            data.nombre_alumno_impresion = nombreAlumnoImpresion

            // Generar un nuevo certificado
            const { result, message, dataResult } = await HPdf.generarCertificado(data, alumno, evento)

            if (!result) {
                return { result, message }
            }

            const outputPath = dataResult?.outputPath
            const fileName = dataResult?.fileName
            const codigoQR = dataResult?.codigoQR
            const codigo = dataResult?.codigo

            data.ruta = outputPath
            data.fileName = fileName
            data.codigoQR = codigoQR
            data.codigo = codigo

            const newCertificado = await Certificado.create(data as any)

            if (newCertificado.id) {
                return { result: true, message: 'Certificado registrado correctamente', data: newCertificado, status: 200 }
            }

            return { result: false, message: 'Error al registrar el certificado', data: [], status: 500 }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async update(id: number, data: ICertificado): Promise<CertificadoResponse> {
        try {
            const certificado = await Certificado.findByPk(id)

            if (!certificado) {
                return { result: false, message: 'Certificado no encontrado', status: 404 }
            }

            const {
                id_alumno,
                id_evento,
                nombre_alumno_impresion,
                fecha_envio,
                ruta
            } = certificado

            if (
                data.id_alumno !== id_alumno ||
                data.id_evento !== id_evento ||
                data.nombre_alumno_impresion !== nombre_alumno_impresion ||
                data.fecha_envio !== fecha_envio
            ) {
                const alumnoResponse = await AlumnoService.getAlumnoPorId(data.id_alumno as number)

                if (!alumnoResponse.result) {
                    if (alumnoResponse.error) {
                        return { result: false, error: alumnoResponse.error, status: 500 }
                    }

                    return { result: false, message: alumnoResponse.message, status: 201 }
                }

                const alumno = alumnoResponse.data as IAlumno

                const { nombre_capitalized } = alumno

                const eventoResponse = await EventoService.getEventoPorId(data.id_evento as number)

                if (!eventoResponse.result) {
                    if (eventoResponse.error) {
                        return { result: false, error: eventoResponse.error, status: 500 }
                    }

                    return { result: false, message: eventoResponse.message, status: 201 }
                }

                const evento = eventoResponse.data as IEvento

                // Reemplazar el archivo anterior si existe
                if (fs.existsSync(ruta as string)) {
                    fs.unlinkSync(ruta as string); // Eliminar el archivo anterior
                }

                const nombreAlumnoImpresion = (data.nombre_alumno_impresion === undefined)
                    ? `${nombre_capitalized}`
                    : HString.capitalizeNames(data.nombre_alumno_impresion)

                data.id = certificado.id
                data.codigo = certificado.codigo
                data.codigoQR = certificado.codigoQR
                data.ruta = ruta
                data.nombre_alumno_impresion = nombreAlumnoImpresion

                // Generar un nuevo archivo PDF
                const { result, message, dataResult } = await HPdf.generarCertificado(data, alumno, evento)

                if (!result) {
                    return { result, message }
                }

                const outputPath = dataResult?.outputPath
                const fileName = dataResult?.fileName
                const codigoQR = dataResult?.codigoQR
                const codigo = dataResult?.codigo

                // Actualizar la base de datos con la nueva ruta y los nuevos datos
                data.ruta = outputPath;
                data.fileName = fileName;
                data.codigoQR = codigoQR;
                data.codigo = codigo;

                // Actualizamos el registro en la base de datos
                const updatedCertificado = await certificado.update(data);

                return { result: true, message: 'Certificado actualizado con éxito', data: updatedCertificado, status: 200 };
            } else {
                // Si no hay cambios que afecten el archivo, solo actualizamos los datos del certificado
                const updatedCertificado = await certificado.update(data);

                return { result: true, message: 'Certificado actualizado con éxito', data: updatedCertificado, status: 200 };
            }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async updateEstado(id: number, estado: boolean): Promise<CertificadoResponse> {
        try {
            const certificado = await Certificado.findByPk(id)

            if (!certificado) {
                return { result: false, message: 'Certificado no encontrado', status: 404 }
            }

            certificado.estado = estado
            await certificado.save()

            return { result: true, message: 'Estado actualizado con éxito', data: certificado, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async delete(id: number): Promise<CertificadoResponse> {
        try {
            const certificado = await Certificado.findByPk(id);

            if (!certificado) {
                return { result: false, message: 'Certificado no encontrado', data: [], status: 200 };
            }

            const { ruta } = certificado

            // Eliminar el archivo del sistema de archivos
            const outputPath = ruta as string
            if (fs.existsSync(outputPath)) {
                fs.unlinkSync(outputPath)
            }

            await certificado.destroy();

            return { result: true, data: { id }, message: 'Certificado eliminado correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new CertificadoRepository()