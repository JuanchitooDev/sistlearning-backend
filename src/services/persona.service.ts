import { IPersona } from "@/interfaces/personaInterface"
import PersonaRepository from "@/repositories/personaRepository"

class PersonaService {
    async getPersonas() {
        return await PersonaRepository.getAll()
    }

    async getPersonaPorId(id: number) {
        return await PersonaRepository.getById(id)
    }

    async getPersonaPorIdTipoDocAndNumDoc(idTipoDoc: number, numDoc: string) {
        return await PersonaRepository.getByIdTipoDocAndNumDoc(idTipoDoc, numDoc)
    }

    async createPersona(data: IPersona) {
        return await PersonaRepository.create(data)
    }

    async updatePersona(id: number, data: IPersona) {
        return await PersonaRepository.update(id, data)
    }

    async deletePersona(id: number) {
        return await PersonaRepository.delete(id)
    }
}

export default new PersonaService() 