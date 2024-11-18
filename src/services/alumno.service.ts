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
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async getAlumnoByNumDoc(numero_documento: string): Promise<AlumnoResponse> {
        try {
            const alumno = await Alumno.findOne({
                where: { numero_documento },
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
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
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
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async updateAlumno(id: number, data: IAlumno): Promise<AlumnoResponse> {
        try {
            const alumno = await Alumno.findByPk(id)

            if (!alumno) {
                return { result: false, message: 'Alumno no encontrado' }
            }

            const fechaNacimientoStr = (data.fecha_nacimiento_str === undefined) ? alumno.fecha_nacimiento_str : data.fecha_nacimiento_str

            const apellidoPaterno = (data.apellido_paterno === undefined) ? alumno.apellido_paterno?.trim() : data.apellido_paterno?.trim()
            const apellidoMaterno = (data.apellido_materno === undefined) ? alumno.apellido_materno?.trim() : data.apellido_materno?.trim()
            const nombres = (data.nombres === undefined) ? alumno.nombres?.trim() : data.nombres?.trim()

            const fechaNacimiento = toZonedTime(fechaNacimientoStr as string, 'America/Lima')
            const nombreCompleto = `${nombres} ${apellidoPaterno} ${apellidoMaterno}`
            const nombreCapitalized = HString.capitalizeNames(nombreCompleto)

            data.apellido_paterno = apellidoPaterno
            data.apellido_materno = apellidoMaterno
            data.nombres = nombres
            data.fecha_nacimiento = fechaNacimiento
            data.nombre_capitalized = nombreCapitalized

            const updatedAlumno = await alumno.update(data)
            return { result: true, message: 'Alumno actualizado con éxito', data: updatedAlumno }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
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
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage };
        }
    }
}

export default new AlumnoService() 