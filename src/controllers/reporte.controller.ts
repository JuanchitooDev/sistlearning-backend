import { Request, Response } from "express";
import ReporteService from '../services/reporte.service';
import TipoDocumentoService from '../services/tipoDocumento.service'
import { IAlumno } from '../interfaces/alumnoInterface'
import HExcel from '../helpers/HExcel'
import path from 'path'
import fs from 'fs'
import { ITipoDocumento } from "../interfaces/tipoDocumentoInterface";
import { IPersona } from "../interfaces/personaInterface";

class ReporteController {
    async listCumpleaniosExcel(req: Request, res: Response) {
        try {
            const PATH_XLSX = `../../public/xlsx/`

            const response = await ReporteService.getCumpleaniosAlumnos()

            const { result, data } = response

            if (result) {

                let abreviaturaTipoDoc = "DNI"

                const alumnos = data as IAlumno[]

                const dataAlumnos = await Promise.all(alumnos.map(async alumno => {
                    console.log('alumno cumpleaño', alumno)

                    const {
                        id,
                        id_tipodocumento,
                        numero_documento,
                        apellido_paterno,
                        apellido_materno,
                        nombres,
                        telefono,
                        fecha_nacimiento_str,
                    } = alumno

                    if (id_tipodocumento) {
                        const responseTipoDoc = await TipoDocumentoService.getTipoPorId(id_tipodocumento)
                        const dataTipoDoc = responseTipoDoc.data as ITipoDocumento
                        const { abreviatura } = dataTipoDoc
                        abreviaturaTipoDoc = abreviatura as string
                    }

                    console.log('abreviaturaTipoDoc', abreviaturaTipoDoc)

                    return {
                        ID: id,
                        NumeroDocumento: numero_documento,
                        TipoDocumento: abreviaturaTipoDoc,
                        ApellidoPaterno: apellido_paterno,
                        ApellidoMaterno: apellido_materno,
                        Nombres: nombres,
                        Telefono: telefono,
                        FechaNacimiento: fecha_nacimiento_str
                    }
                }))

                // Generar el archivo Excel
                const archivoExcel = HExcel.generate(dataAlumnos)

                // Definir la ruta para guardar el archivo en el servidor
                const filePath = path.join(__dirname, `${PATH_XLSX}list-cumpleanios.xlsx`)

                const dir = path.dirname(filePath)
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true })
                }

                // Guardar el archivo Excel en el directorio
                fs.writeFileSync(filePath, archivoExcel)

                // Establecer el encabezado para la descarga del archivo
                res.setHeader('Content-Disposition', 'attachment; filename=list-cumpleanios.xlsx')
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

                // Descargar el archivo desde el servidor
                res.download(filePath, 'list-cumpleanios.xlsx', (err) => {
                    if (err) {
                        console.error('Error al descargar el archivo:', err)
                        res.status(500).json({ message: 'Error al descargar el archivo Excel' })
                    }
                })
            } else {
                res.status(400).json({ message: 'No se encontraron datos de cumpleaños' })
            }
        } catch (error) {
            console.error('Error al generar el archivo Excel:', error)
            res.status(500).json({ message: 'Error al generar el archivo Excel' })
        }
    }

    async listAlumnosExcel(req: Request, res: Response) {
        try {
            const PATH_XLSX = `../../public/xlsx/`

            const response = await ReporteService.getAlumnos()

            const { result, data } = response

            if (result) {
                let abreviaturaTipoDoc = "DNI"

                const alumnos = data as IAlumno[]

                const dataAlumnos = await Promise.all(alumnos.map(async alumno => {
                    console.log('alumno listado', alumno)

                    const {
                        id,
                        id_tipodocumento,
                        numero_documento,
                        apellido_paterno,
                        apellido_materno,
                        nombres,
                        telefono,
                        fecha_nacimiento_str
                    } = alumno

                    if (id_tipodocumento) {
                        const responseTipoDoc = await TipoDocumentoService.getTipoPorId(id_tipodocumento)
                        const dataTipoDoc = responseTipoDoc.data as ITipoDocumento
                        const { abreviatura } = dataTipoDoc
                        abreviaturaTipoDoc = abreviatura as string
                    }

                    console.log('abreviaturaTipoDoc', abreviaturaTipoDoc)

                    return {
                        ID: id,
                        NumeroDocumento: numero_documento,
                        TipoDocumento: abreviaturaTipoDoc,
                        ApellidoPaterno: apellido_paterno,
                        ApellidoMaterno: apellido_materno,
                        Nombres: nombres,
                        Telefono: telefono,
                        FechaNacimiento: fecha_nacimiento_str
                    }
                }))

                // Generar el archivo Excel
                const archivoExcel = HExcel.generate(dataAlumnos)

                // Definir la ruta para guardar el archivo en el servidor
                const filePath = path.join(__dirname, `${PATH_XLSX}list-alumnos.xlsx`)

                const dir = path.dirname(filePath)
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true })
                }

                // Guardar el archivo Excel en el directorio
                fs.writeFileSync(filePath, archivoExcel)

                // Establecer el encabezado para la descarga del archivo
                res.setHeader('Content-Disposition', 'attachment; filename=list-alumnos.xlsx')
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

                // Descargar el archivo desde el servidor
                res.download(filePath, 'list-alumnos.xlsx', (err) => {
                    if (err) {
                        console.error('Error al descargar el archivo:', err)
                        res.status(500).json({ message: 'Error al descargar el archivo Excel' })
                    }
                })
            } else {
                res.status(400).json({ message: 'No se encontraron datos de alumnos' })
            }
        } catch (error) {
            console.error('Error al generar el archivo Excel:', error)
            res.status(500).json({ message: 'Error al generar el archivo Excel' })
        }
    }

    async listPersonasExcel(req: Request, res: Response) {
        try {
            const PATH_XLSX = `../../public/xlsx/`

            const response = await ReporteService.getPersonas()

            const { result, data } = response

            if (result) {
                let abreviaturaTipoDoc = "DNI"

                const personas = data as IPersona[]

                const dataPersonas = await Promise.all(personas.map(async persona => {
                    console.log('persona listPersonasExcel', persona)

                    const {
                        id,
                        id_tipodocumento,
                        numero,
                        apellido_paterno,
                        apellido_materno,
                        nombres,
                        fecha_nacimiento
                    } = persona

                    if (id_tipodocumento) {
                        const responseTipoDoc = await TipoDocumentoService.getTipoPorId(id_tipodocumento)
                        const dataTipoDoc = responseTipoDoc.data as ITipoDocumento
                        const { abreviatura } = dataTipoDoc
                        abreviaturaTipoDoc = abreviatura as string
                    }

                    console.log('abreviaturaTipoDoc', abreviaturaTipoDoc)

                    return {
                        ID: id,
                        NumeroDocumento: numero,
                        TipoDocumento: abreviaturaTipoDoc,
                        ApellidoPaterno: apellido_paterno,
                        ApellidoMaterno: apellido_materno,
                        Nombres: nombres,
                        FechaNacimiento: fecha_nacimiento
                    }
                }))

                // Generar el archivo Excel
                const archivoExcel = HExcel.generate(dataPersonas)

                // Definir la ruta para guardar el archivo en el servidor
                const filePath = path.join(__dirname, `${PATH_XLSX}list-personas.xlsx`)

                const dir = path.dirname(filePath)
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true })
                }

                // Guardar el archivo Excel en el directorio
                fs.writeFileSync(filePath, archivoExcel)

                // Establecer el encabezado para la descarga del archivo
                res.setHeader('Content-Disposition', 'attachment; filename=list-personas.xlsx')
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

                // Descargar el archivo desde el servidor
                res.download(filePath, 'list-personas.xlsx', (err) => {
                    if (err) {
                        console.error('Error al descargar el archivo:', err)
                        res.status(500).json({ message: 'Error al descargar el archivo Excel' })
                    }
                })
            } else {
                res.status(400).json({ message: 'No se encontraron datos de personas' })
            }
        } catch (error) {
            console.error('Error al generar el archivo Excel:', error)
            res.status(500).json({ message: 'Error al generar el archivo Excel' })
        }
    }
}

export default new ReporteController()