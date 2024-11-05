import Persona from '../models/persona.models'
import { IPersona, PersonaResponse } from '../interfaces/personaInterface'
import TipoDocumento from '../models/tipoDocumento.models';

class PersonaService {
    async getPersonas(): Promise<PersonaResponse> {
        try {
            const personas = await Persona.findAll({
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
                include: [
                    {
                        model: TipoDocumento,
                        attributes: ['id', 'nombre']
                    }
                ]
            })
            if (!persona) {
                return { result: false, error: 'Persona no encontrada' }
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
                include: [
                    {
                        model: TipoDocumento,
                        attributes: ['id', 'nombre']
                    }
                ]
            })
            console.log('persona in getPersonaByIdTipoDocAndNumDoc', persona)
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
            return { result: true, data: newPersona }
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
                return { result: false, error: 'Persona no encontrada' }
            }
            const updatedPersona = await persona.update(data)
            return { result: true, data: updatedPersona }
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
                return { result: false, error: 'Persona no encontrada' };
            }
            await persona.destroy();
            return { result: true, data: { id } };
        } catch (error) {
            // const msg = `Error al eliminar el personal: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg };
        }
    }
}

export default new PersonaService() 