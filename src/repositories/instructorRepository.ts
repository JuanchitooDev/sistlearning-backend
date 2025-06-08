import HString from "@/helpers/HString";
import { IInstructor, InstructorResponse } from "@/interfaces/instructorInterface";
import Instructor from "@/models/instructor.models"
import Pais from "@/models/pais.models";
import TipoDocumento from "@/models/tipoDocumento.models";

class InstructorRepository {
    async getAll(): Promise<InstructorResponse> {
        try {
            const instructores = await Instructor.findAll({
                attributes: [
                    'id',
                    'id_tipodocumento',
                    'id_pais',
                    'numero_documento',
                    'apellido_paterno',
                    'apellido_materno',
                    'nombres',
                    'nombre_capitalized',
                    'telefono',
                    'direccion',
                    'email',
                    'fecha_nacimiento',
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
                    }
                ],
                order: [
                    ['apellido_paterno', 'ASC']
                ]
            })

            return { result: true, data: instructores, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getAllByEstado(estado: boolean): Promise<InstructorResponse> {
        try {
            const instructores = await Instructor.findAll({
                where: {
                    activo: estado
                },
                attributes: [
                    'id',
                    'id_tipodocumento',
                    'id_pais',
                    'numero_documento',
                    'apellido_paterno',
                    'apellido_materno',
                    'nombres',
                    'nombre_capitalized',
                    'telefono',
                    'direccion',
                    'email',
                    'fecha_nacimiento',
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
                    }
                ],
                order: [
                    ['apellido_paterno', 'ASC']
                ]
            })

            return { result: true, data: instructores, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getById(id: number): Promise<InstructorResponse> {
        try {
            const instructor = await Instructor.findByPk(id, {
                attributes: [
                    'id',
                    'id_tipodocumento',
                    'id_pais',
                    'numero_documento',
                    'apellido_paterno',
                    'apellido_materno',
                    'nombres',
                    'nombre_capitalized',
                    'telefono',
                    'direccion',
                    'email',
                    'fecha_nacimiento',
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
                    }
                ]
            })

            if (!instructor) {
                return { result: false, data: [], message: 'Instructor no encontrado', status: 200 }
            }

            return { result: true, data: instructor, message: 'Instructor encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getByTipoDocNumDoc(idTipoDoc: number, numDoc: string): Promise<InstructorResponse> {
        try {
            const instructor = await Instructor.findOne({
                where: {
                    id_tipodocumento: idTipoDoc,
                    numero_documento: numDoc
                },
                attributes: [
                    'id',
                    'id_tipodocumento',
                    'id_pais',
                    'numero_documento',
                    'apellido_paterno',
                    'apellido_materno',
                    'nombres',
                    'telefono',
                    'direccion',
                    'email',
                    'fecha_nacimiento',
                    'nombre_capitalized',
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
                    }
                ]
            })

            if (!instructor) {
                return { result: false, data: [], message: 'Instructor no encontrado', status: 200 }
            }

            return { result: true, data: instructor, message: 'Instructor encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getByNumDoc(numDoc: string): Promise<InstructorResponse> {
        try {
            const instructor = await Instructor.findOne({
                where: { numDoc },
                attributes: [
                    'id',
                    'id_tipodocumento',
                    'id_pais',
                    'numero_documento',
                    'apellido_paterno',
                    'apellido_materno',
                    'nombres',
                    'telefono',
                    'direccion',
                    'email',
                    'fecha_nacimiento',
                    'nombre_capitalized',
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
                    }
                ]
            })

            if (!instructor) {
                return { result: false, data: [], message: 'Instructor no encontrado', status: 200 }
            }

            return { result: true, data: instructor, message: 'Instructor encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async create(data: IInstructor): Promise<InstructorResponse> {
        try {
            const nombreCompleto = `${data.nombres} ${data.apellido_paterno} ${data.apellido_materno}`
            const options = {
                timeZone: 'America/Lima',
                hour12: false
            }
            const nombreCapitalized = HString.capitalizeNames(nombreCompleto)

            data.apellido_paterno = data.apellido_paterno?.trim()
            data.apellido_materno = data.apellido_materno?.trim()
            data.nombres = data.nombres?.trim()
            data.nombre_capitalized = nombreCapitalized

            const newInstructor = await Instructor.create(data as any)

            if (newInstructor.id) {
                return { result: true, message: 'Instructor registrado con éxito', data: newInstructor, status: 200 }
            }

            return { result: false, message: 'Error al registrar al instructor', data: [], status: 500 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async update(id: number, data: IInstructor): Promise<InstructorResponse> {
        try {
            const instructor = await Instructor.findByPk(id)

            if (!instructor) {
                return { result: false, data: [], message: 'Instructor no encontrado', status: 200 }
            }

            const apellidoPaterno = (data.apellido_paterno === undefined) ? instructor.apellido_paterno?.trim() : data.apellido_paterno?.trim()
            const apellidoMaterno = (data.apellido_materno === undefined) ? instructor.apellido_materno?.trim() : data.apellido_materno?.trim()
            const nombres = (data.nombres === undefined) ? instructor.nombres?.trim() : data.nombres?.trim()

            const nombreCompleto = `${nombres} ${apellidoPaterno} ${apellidoMaterno}`
            const nombreCapitalized = HString.capitalizeNames(nombreCompleto)

            data.apellido_paterno = apellidoPaterno
            data.apellido_materno = apellidoMaterno
            data.nombres = nombres
            data.nombre_capitalized = nombreCapitalized

            const updatedInstructor = await instructor.update(data)

            return { result: true, message: 'Instructor actualizado con éxito', data: updatedInstructor, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async updateEstado(id: number, estado: boolean): Promise<InstructorResponse> {
        try {
            const instructor = await Instructor.findByPk(id)

            if (!instructor) {
                return { result: false, data: [], message: 'Instructor no encontrado', status: 200 }
            }

            instructor.estado = estado
            await instructor.save()

            return { result: true, message: 'Estado actualizado con éxito', data: instructor, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async delete(id: number): Promise<InstructorResponse> {
        try {
            const instructor = await Instructor.findByPk(id);

            if (!instructor) {
                return { result: false, data: [], message: 'Instructor no encontrado', status: 200 };
            }

            await instructor.destroy();

            return { result: true, data: { id }, message: 'Instructor eliminado correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new InstructorRepository()