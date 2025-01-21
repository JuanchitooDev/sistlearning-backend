import { Request, Response } from "express";
import ReporteService from '../services/reporte.service';
import { IAlumno } from '../interfaces/alumnoInterface'
import HExcel from '../helpers/HExcel'

class ReporteController {
    async getAllForBirthday(req: Request, res: Response) {
        try {
            const response = await ReporteService.getAllForBirthday()
            if (response.result) {
                const alumnos = response.data as IAlumno[]
                const data = alumnos.map(alumno => ({
                    ID: alumno.id,
                    ApellidoPaterno: alumno.apellido_paterno,
                    ApellidoMaterno: alumno.apellido_materno,
                    Nombres: alumno.nombre_capitalized,
                    FechaNacimiento: alumno.fecha_nacimiento?.toISOString().split("T")[0],
                    Estado: alumno.estado
                }))

                // Generar el archivo Excel
                const archivoExcel = HExcel.generate(data)

                // Establecer el encabezado para la descarga del archivo
                res.setHeader('Content-Disposition', 'attachment; filename=cumpleanios.xlsx')
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

                // Enviar el archivo Excel como respuesta
                res.send(archivoExcel)
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el reporte de cumpleaños' });
        }
    }
}

export default new ReporteController()