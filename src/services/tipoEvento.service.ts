import { ITipoEvento } from "@/interfaces/tipoEventoInterface"
import TipoEventoRepository from "@/repositories/tipoEventoRepository"

class TipoEventoService {
    async getTipos() {
        return await TipoEventoRepository.getAll()
    }

    async getTiposPorEstado(estado: boolean) {
        return await TipoEventoRepository.getAllByEstado(estado)
    }

    async getTipoPorId(id: number) {
        return await TipoEventoRepository.getById(id)
    }

    async createTipo(data: ITipoEvento) {
        return await TipoEventoRepository.create(data)
    }

    async updateTipo(id: number, data: ITipoEvento) {
        return await TipoEventoRepository.update(id, data)
    }

    async deleteTipo(id: number) {
        return await TipoEventoRepository.delete(id)
    }
}

export default new TipoEventoService()