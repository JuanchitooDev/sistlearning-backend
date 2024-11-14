import Alumno from '../models/alumno.models'
import { IAlumno, AlumnoResponse } from '../interfaces/alumnoInterface'
import TipoDocumento from '../models/tipoDocumento.models';
import Pais from '../models/pais.models';
import Departamento from '../models/departamento.models';
import HString from '../helpers/HString'
import { toZonedTime } from 'date-fns-tz'

class AlumnoService {
    async getAlumnos(): Promise<AlumnoResponse> {
        try {
            const alumnos = await Alumno.findAll({
                attributes: [
                    'id', 'id_tipodocumento', 'id_pais', 'id_departamento', 'numero_documento', 'apellido_paterno', 'apellido_materno', 'nombres', 'telefono', 'direccion', 'email', 'fecha_nacimiento', 'sexo', 'sistema', 'estado', 'nombre_capitalized', 'fecha_nacimiento_str'
                ],
                include: [{
                    model: TipoDocumento,
                    attributes: ['id', 'nombre', 'abreviatura']
                }, {
                    model: Pais,
                    attributes: ['id', 'nombre']
                }, {
                    model: Departamento,
                    attributes: ['id', 'nombre']
                }]
            })
            return { result: true, data: alumnos }
        } catch (error) {
            // const msg = `Error al obtener los alumnos: ${error.message}`
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async getAlumnoById(id: number): Promise<AlumnoResponse> {
        try {
            const alumno = await Alumno.findByPk(id, {
                attributes: [
                    'id', 'id_tipodocumento', 'id_pais', 'id_departamento', 'numero_documento', 'apellido_paterno', 'apellido_materno', 'nombres', 'telefono', 'direccion', 'email', 'fecha_nacimiento', 'sexo', 'sistema', 'estado', 'nombre_capitalized', 'fecha_nacimiento_str'
                ],
                include: [{
                    model: TipoDocumento,
                    attributes: ['id', 'nombre', 'abreviatura']
                }, {
                    model: Pais,
                    attributes: ['id', 'nombre']
                }, {
                    model: Departamento,
                    attributes: ['id', 'nombre']
                }]
            })
            if (!alumno) {
                return { result: false, message: 'Alumno no encontrado' }
            }
            return { result: true, data: alumno }
        } catch (error) {
            // const msg = `Error al obtener el alumno: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async createAlumno(data: IAlumno): Promise<AlumnoResponse> {
        try {
            const fechaNacimiento = toZonedTime(data.fecha_nacimiento_str as string, 'America/Lima')
            const nombreCompleto = `${data.nombres} ${data.apellido_paterno} ${data.apellido_materno}`
            const nombreCapitalized = HString.capitalizeNames(nombreCompleto)

            data.apellido_paterno = data.apellido_paterno?.trim()
            data.apellido_materno = data.apellido_materno?.trim()
            data.nombres = data.nombres?.trim()

            data.fecha_nacimiento = fechaNacimiento
            data.nombre_capitalized = nombreCapitalized

            const newAlumno = await Alumno.create(data as any)

            if (newAlumno.id) {
                return { result: true, message: 'Alumno registrado con éxito', data: newAlumno }
            } else {
                return { result: false, message: 'Error al registrar al alumno' }
            }
        } catch (error) {
            // const msg = `Error al crear el alumno: ${error.message}`
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async updateAlumno(id: number, data: IAlumno): Promise<AlumnoResponse> {
        try {
            const fechaNacimiento = toZonedTime(data.fecha_nacimiento_str as string, 'America/Lima')
            const nombreCompleto = `${data.nombres} ${data.apellido_paterno} ${data.apellido_materno}`
            const nombreCapitalized = HString.capitalizeNames(nombreCompleto)

            console.log('data updateAlumno', data)
            console.log('fechaNacimiento', fechaNacimiento)

            data.apellido_paterno = data.apellido_paterno?.trim()
            data.apellido_materno = data.apellido_materno?.trim()
            data.nombres = data.nombres?.trim()
            data.fecha_nacimiento = fechaNacimiento
            data.nombre_capitalized = nombreCapitalized

            const alumno = await Alumno.findByPk(id)
            
            if (!alumno) {
                return { result: false, message: 'Alumno no encontrado' }
            }

            const updatedAlumno = await alumno.update(data)
            return { result: true, message: 'Alumno actualizado con éxito', data: updatedAlumno }
        } catch (error) {
            // const msg = `Error al actualizar el alumno: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async deleteAlumno(id: number): Promise<AlumnoResponse> {
        try {
            const alumno = await Alumno.findByPk(id);
            if (!alumno) {
                return { result: false, message: 'Alumno no encontrado' };
            }
            await alumno.destroy();
            return { result: true, data: { id }, message: 'Alumno eliminado correctamente' };
        } catch (error) {
            // const msg = `Error al eliminar el alumno: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg };
        }
    }
}

export default new AlumnoService() 