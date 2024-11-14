import Persona from '../models/persona.models'
import { IPersona, PersonaResponse } from '../interfaces/personaInterface'
import TipoDocumento from '../models/tipoDocumento.models';

class PersonaService {
    async getPersonas(): Promise<PersonaResponse> {
        try {
            const personas = await Persona.findAll({
                attributes: [
                    'id', 'id_tipodocumento', 'numero', 'nombres', 'apellido_paterno', 'apellido_materno', 'nombre_completo', 'departamento', 'provincia', 'distrito', 'direccion', 'direccion_completa', 'ubigeo_reniec', 'ubigeo_sunat', 'ubigeo', 'fecha_nacimiento', 'estado_civil', 'foto', 'sexo', 'origen', 'estado'
                ],
                include: [
                    {
                        model: TipoDocumento,
                        attributes: ['id', 'nombre']
                    }
                ]
            })
            return { result: true, data: personas }
        } catch (error) {
            // const msg = `Error al obtener el personal: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async getPersonaById(id: number): Promise<PersonaResponse> {
        try {
            const persona = await Persona.findByPk(id, {
                attributes: [
                    'id', 'id_tipodocumento', 'numero', 'nombres', 'apellido_paterno', 'apellido_materno', 'nombre_completo', 'departamento', 'provincia', 'distrito', 'direccion', 'direccion_completa', 'ubigeo_reniec', 'ubigeo_sunat', 'ubigeo', 'fecha_nacimiento', 'estado_civil', 'foto', 'sexo', 'origen', 'estado'
                ],
                include: [
                    {
                        model: TipoDocumento,
                        attributes: ['id', 'nombre']
                    }
                ]
            })
            if (!persona) {
                return { result: false, message: 'Persona no encontrada' }
            }
            return { result: true, data: persona }
        } catch (error) {
            // const msg = `Error al obtener el personal: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async getPersonaByIdTipoDocAndNumDoc(idTipoDoc: number, numDoc: string): Promise<PersonaResponse> {
        try {
            const persona = await Persona.findOne({
                where: {
                    id_tipodocumento: idTipoDoc,
                    numero: numDoc
                },
                attributes: [
                    'id', 'id_tipodocumento', 'numero', 'nombres', 'apellido_paterno', 'apellido_materno', 'nombre_completo', 'departamento', 'provincia', 'distrito', 'direccion', 'direccion_completa', 'ubigeo_reniec', 'ubigeo_sunat', 'ubigeo', 'fecha_nacimiento', 'estado_civil', 'foto', 'sexo', 'origen', 'estado'
                ],
                include: [
                    {
                        model: TipoDocumento,
                        attributes: ['id', 'nombre']
                    }
                ]
            })
            if (!persona) {
                return { result: false, message: 'Persona no encontrada' }
            }
            return { result: true, data: persona }
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: msg }
        }
    }

    async createPersona(data: IPersona): Promise<PersonaResponse> {
        try {
            const newPersona = await Persona.create(data as any)
            if (newPersona.id) {
                return { result: true, message: 'Persona registrada con éxito', data: newPersona }
            } else {
                return { result: false, message: 'Error al registrar la persona' }
            }
        } catch (error) {
            // const msg = `Error al crear el personal: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async updatePersona(id: number, data: IPersona): Promise<PersonaResponse> {
        try {
            const persona = await Persona.findByPk(id)
            if (!persona) {
                return { result: false, message: 'Persona no encontrada' }
            }
            const updatedPersona = await persona.update(data)
            return { result: true, message: 'Persona actualiza con éxito', data: updatedPersona }
        } catch (error) {
            // const msg = `Error al actualizar el personal: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async deletePersona(id: number): Promise<PersonaResponse> {
        try {
            const persona = await Persona.findByPk(id);
            if (!persona) {
                return { result: false, message: 'Persona no encontrada' };
            }
            await persona.destroy();
            return { result: true, data: { id }, message: 'Persona eliminada correctamente' };
        } catch (error) {
            // const msg = `Error al eliminar el personal: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg };
        }
    }
}

export default new PersonaService() 