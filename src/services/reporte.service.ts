import { AlumnoResponse } from "../interfaces/alumnoInterface";
import Alumno from "../models/alumno.models";
import TipoDocumento from '../models/tipoDocumento.models';
import Pais from '../models/pais.models';
import Departamento from '../models/departamento.models';

class ReporteService {
    async getCumpleaniosAlumnos(): Promise<AlumnoResponse> {
        try {
            const alumnos = await Alumno.findAll({
                where: {
                    estado: 1
                },
                attributes: [
                    'id',
                    'id_tipodocumento',
                    'id_pais',
                    'id_departamento',
                    'numero_documento',
                    'apellido_paterno',
                    'apellido_materno',
                    'nombres',
                    'telefono',
                    'direccion',
                    'email',
                    'fecha_nacimiento',
                    'nombre_capitalized',
                    'fecha_nacimiento_str',
                    'sexo',
                    'sistema',
                    'estado'
                ],
                include: [
                    {
                        model: TipoDocumento,
                        attributes: ['id', 'nombre', 'abreviatura']
                    }, {
                        model: Pais,
                        attributes: ['id', 'nombre']
                    }, {
                        model: Departamento,
                        attributes: ['id', 'nombre']
                    }
                ]
            })

            return { result: true, data: alumnos }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }
}

export default new ReporteService()