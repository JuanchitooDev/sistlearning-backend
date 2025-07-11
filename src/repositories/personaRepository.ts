import sequelize from "../config/db";
import { IPersona, PersonaResponse } from "../interfaces/personaInterface";
import { IAlumno } from "../interfaces/alumnoInterface"
import Persona from "../models/persona.models"
import TipoDocumento from "../models/tipoDocumento.models";
import AlumnoService from "../services/alumno.service"
import { toZonedTime } from "date-fns-tz";

class PersonaRepository {
    async getAll(): Promise<PersonaResponse> {
        try {
            const personas = await Persona.findAll({
                attributes: [
                    'id',
                    'id_tipodocumento',
                    'numero',
                    'nombres',
                    'apellido_paterno',
                    'apellido_materno',
                    'nombre_completo',
                    'departamento',
                    'provincia',
                    'distrito',
                    'direccion',
                    'direccion_completa',
                    'ubigeo_reniec',
                    'ubigeo_sunat',
                    'ubigeo',
                    'fecha_nacimiento',
                    'estado_civil',
                    'foto',
                    'sexo',
                    'origen',
                    'estado'
                ],
                include: [
                    {
                        model: TipoDocumento,
                        attributes: ['id', 'nombre']
                    }
                ],
                order: [
                    ['apellido_paterno', 'ASC']
                ]
            })

            return { result: true, data: personas, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getById(id: number): Promise<PersonaResponse> {
        try {
            const persona = await Persona.findByPk(id, {
                attributes: [
                    'id',
                    'id_tipodocumento',
                    'numero',
                    'nombres',
                    'apellido_paterno',
                    'apellido_materno',
                    'nombre_completo',
                    'departamento',
                    'provincia',
                    'distrito',
                    'direccion',
                    'direccion_completa',
                    'ubigeo_reniec',
                    'ubigeo_sunat',
                    'ubigeo',
                    'fecha_nacimiento',
                    'estado_civil',
                    'foto',
                    'sexo',
                    'origen',
                    'estado'
                ],
                include: [
                    {
                        model: TipoDocumento,
                        attributes: ['id', 'nombre']
                    }
                ],
                order: [
                    ['apellido_paterno', 'ASC']
                ]
            })

            if (!persona) {
                return { result: false, data: [], message: 'Persona no encontrada', status: 200 }
            }

            return { result: true, data: persona, message: 'Persona encontrada', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getByIdTipoDocAndNumDoc(idTipoDoc: number, numDoc: string): Promise<PersonaResponse> {
        try {
            const persona = await Persona.findOne({
                where: {
                    id_tipodocumento: idTipoDoc,
                    numero: numDoc
                },
                attributes: [
                    'id',
                    'id_tipodocumento',
                    'numero',
                    'nombres',
                    'apellido_paterno',
                    'apellido_materno',
                    'nombre_completo',
                    'departamento',
                    'provincia',
                    'distrito',
                    'direccion',
                    'direccion_completa',
                    'ubigeo_reniec',
                    'ubigeo_sunat',
                    'ubigeo',
                    'fecha_nacimiento',
                    'estado_civil',
                    'foto',
                    'sexo',
                    'origen',
                    'estado'
                ],
                include: [
                    {
                        model: TipoDocumento,
                        attributes: ['id', 'nombre']
                    }
                ]
            })

            if (!persona) {
                return { result: false, data: [], message: 'Persona no encontrada', status: 200 }
            }

            return { result: true, data: persona, message: 'Persona encontrada', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async create(data: IPersona): Promise<PersonaResponse> {
        const t = await sequelize.transaction()

        try {
            const newPersona = await Persona.create(data as any)

            await t.commit()

            // console.log('newPersona', newPersona)

            if (newPersona.id) {
                return { result: true, message: 'Persona registrada con éxito', data: newPersona, status: 200 }
            }

            return { result: false, error: 'Error al registrar la persona', data: [], status: 500 }
        } catch (error) {
            await t.rollback()

            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            console.log('errorMessage createPersona', errorMessage)
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async update(id: number, data: IPersona): Promise<PersonaResponse> {
        const t = await sequelize.transaction()

        try {
            const persona = await Persona.findByPk(id)

            if (!persona) {
                return { result: false, data: [], message: 'Persona no encontrada', status: 200 }
            }

            const numero_documento = persona.numero
            const nombres = persona.nombres?.trim()
            const apellido_paterno = persona.apellido_paterno?.trim()
            const apellido_materno = persona.apellido_materno?.trim()
            const nombre_completo = persona.nombre_completo?.trim()
            const departamento = persona.departamento?.trim()
            const provincia = persona.provincia?.trim()
            const distrito = persona.distrito?.trim()
            const direccion = persona.direccion?.trim()
            const direccion_completa = persona.direccion_completa?.trim()

            const fechaNacimiento = persona.fecha_nacimiento as string

            const [dia, mes, anio] = fechaNacimiento.split("/")

            const fechaNacimientoStr = `${anio}-${mes}-${dia}`
            const fechaNacimientoDate = toZonedTime(fechaNacimientoStr as string, 'America/Lima')

            // Validamos si existe un alumno con el número de documento
            const alumno = await AlumnoService.getAlumnoPorNumDoc(numero_documento as string)

            if (alumno.result) {
                const dataAlumno = alumno.data as IAlumno

                // Si existe el alumno, actualizamos su información
                const updatedAlumno = await AlumnoService.updateAlumno(dataAlumno.id as number, {
                    ...alumno.data,
                    nombres,
                    apellido_paterno,
                    apellido_materno,
                    fecha_nacimiento_str: fechaNacimientoStr,
                    fecha_nacimiento: fechaNacimientoDate
                })

                if (!updatedAlumno.result) {
                    await t.rollback()

                    return { result: false, message: 'Error al actualizar la información del alumno', status: 500 }
                }
            }

            data.nombres = nombres
            data.apellido_paterno = apellido_paterno
            data.apellido_materno = apellido_materno
            data.nombre_completo = nombre_completo
            data.departamento = departamento
            data.provincia = provincia
            data.distrito = distrito
            data.direccion = direccion
            data.direccion_completa = direccion_completa

            // Actualizamos la persona
            const updatedPersona = await persona.update(data, { transaction: t })

            await t.commit()

            return { result: true, message: 'Persona actualizada con éxito', data: updatedPersona, status: 200 }
        } catch (error) {
            await t.rollback()

            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';

            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async delete(id: number): Promise<PersonaResponse> {
        try {
            const persona = await Persona.findByPk(id);

            if (!persona) {
                return { result: false, data: [], message: 'Persona no encontrada', status: 200 };
            }

            await persona.destroy();

            return { result: true, data: { id }, message: 'Persona eliminada correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new PersonaRepository()