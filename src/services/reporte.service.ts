import { AlumnoResponse, IAlumno } from "../interfaces/alumnoInterface";
import Alumno from "../models/alumno.models";

class ReporteServices {
    async getAllForBirthday(): Promise<AlumnoResponse> {
        try {
            const alumnos = await Alumno.findAll({
                attributes: [
                    'id',
                    'nombres',
                    'apellido_paterno',
                    'apellido_materno',
                    'telefono',
                    'direccion',
                    'email',
                    'fecha_nacimiento',
                    'nombre_capitalized',
                    'fecha_nacimiento_str',
                ],
                order: [
                    ['fecha_nacimiento', 'DESC']
                ]
            })

            return { result: true, data: alumnos }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }
}

export default new ReporteServices()