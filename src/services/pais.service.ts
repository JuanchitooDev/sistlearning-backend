import { IPais } from "@/interfaces/paisInterface"
import PaisRepository from "@/repositories/paisRepository"

class PaisService {
    async getPaises() {
        return await PaisRepository.getAll()
    }

    async getPaisesPorEstado(estado: boolean) {
        return await PaisRepository.getAllByEstado(estado)
    }

    async getPaisPorId(id: number) {
        return await PaisRepository.getById(id)
    }

    async createPais(data: IPais) {
        return await PaisRepository.create(data)
    }

    async updatePais(id: number, data: IPais) {
        return await PaisRepository.update(id, data)
    }

    async updateEstado(id: number, estado: boolean) {
        return await PaisRepository.updateEstado(id, estado)
    }

    async deletePais(id: number) {
        return await PaisRepository.delete(id)
    }
}

export default new PaisService()