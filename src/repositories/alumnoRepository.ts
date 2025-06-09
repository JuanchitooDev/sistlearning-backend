import HString from "../helpers/HString";
import { IAlumno, AlumnoResponse } from "../interfaces/alumnoInterface";
import Alumno from "../models/alumno.models"
import Departamento from "../models/departamento.models";
import Pais from "../models/pais.models";
import TipoDocumento from "../models/tipoDocumento.models";

class AlumnoRepository {
    async getAll(): Promise<AlumnoResponse> {
        try {
            const alumnos = await Alumno.findAll({
                attributes: [
                    'id',
                    'id_tipodocumento',
                    'id_pais',
                    'id_departamento',
                    'numero_documento',
                    'apellido_paterno',
                    'apellido_materno',
                    'nombres',
                    'nombre_capitalized',
                    'telefono',
                    'direccion',
                    'email',
                    'fecha_nacimiento',
                    'fecha_nacimiento_str',
                    'sexo',
                    'sistema',
                    'estado'
                ],
                include: [
                    {
                        model: TipoDocumento,
                        attributes: ['id', 'nombre', 'abreviatura']
                    },
                    {
                        model: Pais,
                        attributes: ['id', 'nombre']
                    },
                    {
                        model: Departamento,
                        attributes: ['id', 'nombre']
                    }
                ],
                order: [
                    ['apellido_paterno', 'ASC']
                ]
            })

            return { result: true, data: alumnos, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getAllByEstado(estado: boolean): Promise<AlumnoResponse> {
        try {
            const alumnos = await Alumno.findAll({
                where: {
                    activo: estado
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
                    'nombre_capitalized',
                    'telefono',
                    'direccion',
                    'email',
                    'fecha_nacimiento',
                    'fecha_nacimiento_str',
                    'sexo',
                    'sistema',
                    'estado'
                ],
                include: [
                    {
                        model: TipoDocumento,
                        attributes: ['id', 'nombre', 'abreviatura']
                    },
                    {
                        model: Pais,
                        attributes: ['id', 'nombre']
                    },
                    {
                        model: Departamento,
                        attributes: ['id', 'nombre']
                    }
                ],
                order: [
                    ['apellido_paterno', 'ASC']
                ]
            })

            return { result: true, data: alumnos, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getById(id: number): Promise<AlumnoResponse> {
        try {
            const alumno = await Alumno.findByPk(id, {
                attributes: [
                    'id',
                    'id_tipodocumento',
                    'id_pais',
                    'id_departamento',
                    'numero_documento',
                    'apellido_paterno',
                    'apellido_materno',
                    'nombres',
                    'nombre_capitalized',
                    'telefono',
                    'direccion',
                    'email',
                    'fecha_nacimiento',
                    'fecha_nacimiento_str',
                    'sexo',
                    'sistema',
                    'estado'
                ],
                include: [
                    {
                        model: TipoDocumento,
                        attributes: ['id', 'nombre', 'abreviatura']
                    },
                    {
                        model: Pais,
                        attributes: ['id', 'nombre']
                    },
                    {
                        model: Departamento,
                        attributes: ['id', 'nombre']
                    }
                ]
            })

            if (!alumno) {
                return { result: false, data: [], message: 'Alumno no encontrado', status: 200 }
            }

            return { result: true, data: alumno, message: 'Alumno encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getByTipoDocNumDoc(idTipoDoc: number, numDoc: string): Promise<AlumnoResponse> {
        try {
            const alumno = await Alumno.findOne({
                where: {
                    id_tipodocumento: idTipoDoc,
                    numero_documento: numDoc
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
                return { result: false, data: [], message: 'Alumno no encontrado', status: 200 }
            }

            return { result: true, data: alumno, message: 'Alumno encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getByNumDoc(numDoc: string): Promise<AlumnoResponse> {
        try {
            const alumno = await Alumno.findOne({
                where: { numDoc },
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
                return { result: false, data: [], message: 'Alumno no encontrado', status: 200 }
            }

            return { result: true, data: alumno, message: 'Alumno encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async create(data: IAlumno): Promise<AlumnoResponse> {
        try {
            const nombreCompleto = `${data.nombres} ${data.apellido_paterno} ${data.apellido_materno}`
            const options = {
                timeZone: 'America/Lima',
                hour12: false
            }
            const fechaNacimientoStr = data.fecha_nacimiento?.toLocaleString('es-PE', options)
            const nombreCapitalized = HString.capitalizeNames(nombreCompleto)

            data.apellido_paterno = data.apellido_paterno?.trim()
            data.apellido_materno = data.apellido_materno?.trim()
            data.nombres = data.nombres?.trim()

            data.fecha_nacimiento_str = fechaNacimientoStr
            data.nombre_capitalized = nombreCapitalized

            const newAlumno = await Alumno.create(data as any)

            if (newAlumno.id) {
                return { result: true, message: 'Alumno registrado con éxito', data: newAlumno, status: 200 }
            }

            return { result: false, message: 'Error al registrar al alumno', data: [], status: 500 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async update(id: number, data: IAlumno): Promise<AlumnoResponse> {
        try {
            const alumno = await Alumno.findByPk(id)

            if (!alumno) {
                return { result: false, data: [], message: 'Alumno no encontrado', status: 200 }
            }

            const fechaNacimiento = (data.fecha_nacimiento == undefined) ? alumno.fecha_nacimiento : data.fecha_nacimiento
            const options = {
                timeZone: 'America/Lima',
                hour12: false
            }
            const fechaNacimientoStr = fechaNacimiento?.toLocaleString('es-PE', options)

            const apellidoPaterno = (data.apellido_paterno === undefined) ? alumno.apellido_paterno?.trim() : data.apellido_paterno?.trim()
            const apellidoMaterno = (data.apellido_materno === undefined) ? alumno.apellido_materno?.trim() : data.apellido_materno?.trim()
            const nombres = (data.nombres === undefined) ? alumno.nombres?.trim() : data.nombres?.trim()

            const nombreCompleto = `${nombres} ${apellidoPaterno} ${apellidoMaterno}`
            const nombreCapitalized = HString.capitalizeNames(nombreCompleto)

            data.apellido_paterno = apellidoPaterno
            data.apellido_materno = apellidoMaterno
            data.nombres = nombres
            data.fecha_nacimiento = fechaNacimiento
            data.fecha_nacimiento_str = fechaNacimientoStr
            data.nombre_capitalized = nombreCapitalized

            const updatedAlumno = await alumno.update(data)
            return { result: true, message: 'Alumno actualizado con éxito', data: updatedAlumno, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async updateEstado(id: number, estado: boolean): Promise<AlumnoResponse> {
        try {
            const alumno = await Alumno.findByPk(id)

            if (!alumno) {
                return { result: false, data: [], message: 'Alumno no encontrado', status: 200 }
            }

            alumno.estado = estado
            await alumno.save()

            return { result: true, message: 'Estado actualizado con éxito', data: alumno, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async delete(id: number): Promise<AlumnoResponse> {
        try {
            const alumno = await Alumno.findByPk(id);

            if (!alumno) {
                return { result: false, data: [], message: 'Alumno no encontrado', status: 200 };
            }

            await alumno.destroy();

            return { result: true, data: { id }, message: 'Alumno eliminado correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new AlumnoRepository()