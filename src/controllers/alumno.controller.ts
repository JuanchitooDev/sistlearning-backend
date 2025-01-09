import { Request, Response } from 'express'
import AlumnoService from '../services/alumno.service'
import { IAlumno } from '../interfaces/alumnoInterface'
import HExcel from '../helpers/HExcel'

class AlumnoController {
    async getAlumnos(req: Request, res: Response) {
        const response = await AlumnoService.getAlumnos()
        if (response.result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
        }
    }

    async getAlumnoById(req: Request, res: Response) {
        const response = await AlumnoService.getAlumnoById(+req.params.id)
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

    async getCumpleanios(req: Request, res: Response) {
        try {
            // Obtener los alumnos
            const responseAlumnos = await AlumnoService.getCumpleanios()

            // Convertir los resultados a formato adecuado para Excel
            if (responseAlumnos.result) {
                const alumnos = responseAlumnos.data as IAlumno[]
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
            res.status(500).json({ message: 'Error al generar el archivo Excel'})
        }
    }

    async createAlumno(req: Request, res: Response) {
        const response = await AlumnoService.createAlumno(req.body);
        if (response.result) {
            res.status(201).json(response);
        } else {
            if (response.message) {
                res.status(404).send(response)
            } else {
                res.status(500).send(response)
            }
        }
    }

    async updateAlumno(req: Request, res: Response) {
        const { id } = req.params;
        const response = await AlumnoService.updateAlumno(+id, req.body);
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

    async deleteAlumno(req: Request, res: Response) {
        const { id } = req.params;
        const response = await AlumnoService.deleteAlumno(+id);
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

export default new AlumnoController()