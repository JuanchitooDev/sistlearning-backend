import { IPerfil } from "@/interfaces/perfilInterface"
import PerfilRepository from "@/repositories/perfilRepository"

class PerfilService {
    async getPerfiles() {
        return await PerfilRepository.getAll()
    }

    async getPerfilesPorEstado(estado: boolean) {
        return await PerfilRepository.getAllByEstado(estado)
    }

    async getPerfilPorId(id: number) {
        return await PerfilRepository.getById(id)
    }

    async createPerfil(data: IPerfil) {
        return await PerfilRepository.create(data)
    }

    async updatePerfil(id: number, data: IPerfil) {
        return await PerfilRepository.update(id, data)
    }

    async deletePerfil(id: number) {
        return await PerfilRepository.delete(id)
    }
}

export default new PerfilService() 