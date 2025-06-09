import { Request, Response } from "express";
import ReporteService from '../services/reporte.service';
import { IAlumno } from '../interfaces/alumnoInterface'
import HExcel from '../helpers/HExcel'
import path from 'path'
import fs from 'fs'

class ReporteController {
    async getCumpleaniosAlumnos(req: Request, res: Response) {
        try {
            const response = await ReporteService.getCumpleaniosAlumnos()

            if (response.result) {
                const alumnos = response.data as IAlumno[]

                const data = alumnos.map(alumno => {
                    const id = alumno.id
                    const apellidoPaterno = alumno.apellido_paterno
                    const apellidoMaterno = alumno.apellido_materno
                    const nombres = alumno.nombres
                    const telefono = alumno.telefono
                    const fechaNacimiento = alumno.fecha_nacimiento_str

                    return {
                        ID: id,
                        ApellidoPaterno: apellidoPaterno,
                        ApellidoMaterno: apellidoMaterno,
                        Nombres: nombres,
                        Telefono: telefono,
                        FechaNacimiento: fechaNacimiento
                    }
                })

                // Generar el archivo Excel
                const archivoExcel = HExcel.generate(data)

                // Establecer el encabezado para la descarga del archivo
                res.setHeader('Content-Disposition', 'attachment; filename=cumpleanios.xlsx')
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

                // Enviar el archivo Excel como respuesta
                res.send(archivoExcel)
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al generar el archivo Excel' })
        }
    }

    async saveExcelFile(req: Request, res: Response) {
        try {
            const response = await ReporteService.getCumpleaniosAlumnos()

            if (response.result) {
                const alumnos = response.data as IAlumno[]

                const data = alumnos.map(alumno => {
                    const id = alumno.id
                    const apellidoPaterno = alumno.apellido_paterno
                    const apellidoMaterno = alumno.apellido_materno
                    const nombres = alumno.nombres
                    const telefono = alumno.telefono
                    const fechaNacimiento = alumno.fecha_nacimiento_str

                    return {
                        ID: id,
                        ApellidoPaterno: apellidoPaterno,
                        ApellidoMaterno: apellidoMaterno,
                        Nombres: nombres,
                        Telefono: telefono,
                        FechaNacimiento: fechaNacimiento
                    }
                })

                // Generar el archivo Excel
                const archivoExcel = HExcel.generate(data)

                // Definir la ruta para guardar el archivo en el servidor
                const filePath = path.join(__dirname, '../../public/xlsx/cumpleanios.xlsx')

                const dir = path.dirname(filePath)
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true })
                }

                // Guardar el archivo Excel en el directorio
                fs.writeFileSync(filePath, archivoExcel)

                // Establecer el encabezado para la descarga del archivo
                res.setHeader('Content-Disposition', 'attachment; filename=cumpleanios.xlsx')
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

                // Descargar el archivo desde el servidor
                res.download(filePath, 'cumpleanios.xlsx', (err) => {
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
}

export default new ReporteController()