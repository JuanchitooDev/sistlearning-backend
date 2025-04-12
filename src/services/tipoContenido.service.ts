import { ITipoContenido } from "@/interfaces/tipoContenidoInterface"
import TipoContenidoRepository from "@/repositories/tipoContenidoRepository"

class TipoContenidoService {
    async getTipos() {
        return await TipoContenidoRepository.getAll()
    }

    async getTiposPorEstado(estado: boolean) {
        return await TipoContenidoRepository.getAllByEstado(estado)
    }

    async getTipoPorId(id: number) {
        return await TipoContenidoRepository.getById(id)
    }

    async createTipo(data: ITipoContenido) {
        return await TipoContenidoRepository.create(data)
    }

    async updateTipo(id: number, data: ITipoContenido) {
        return await TipoContenidoRepository.update(id, data)
    }

    async deleteTipo(id: number) {
        return await TipoContenidoRepository.delete(id)
    }
}

export default new TipoContenidoService()