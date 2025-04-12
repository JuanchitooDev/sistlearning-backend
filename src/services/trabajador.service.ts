import { ITrabajador } from "@/interfaces/trabajadorInterface"
import TrabajadorRepository from "@/repositories/trabajadorRepository"

class TrabajadorService {
    async getTrabajadores() {
        return await TrabajadorRepository.getAll()
    }

    async getTrabajadorPorId(id: number) {
        return await TrabajadorRepository.getById(id)
    }

    async createTrabajador(data: ITrabajador) {
        return await TrabajadorRepository.create(data)
    }

    async updateTrabajador(id: number, data: ITrabajador) {
        return await TrabajadorRepository.update(id, data)
    }

    async deleteTrabajador(id: number) {
        return await TrabajadorRepository.delete(id)
    }
}

export default new TrabajadorService() 