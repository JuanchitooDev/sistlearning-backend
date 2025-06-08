import { ITipoAdjunto } from "@/interfaces/tipoAdjuntoInterface"
import TipoAdjuntoRepository from "@/repositories/tipoAdjuntoRepository"

class TipoAdjuntoService {
    async getTipos() {
        return await TipoAdjuntoRepository.getAll()
    }

    async getTiposPorEstado(estado: boolean) {
        return await TipoAdjuntoRepository.getAllByEstado(estado)
    }

    async getTipoPorId(id: number) {
        return await TipoAdjuntoRepository.getById(id)
    }

    async createTipo(data: ITipoAdjunto) {
        return await TipoAdjuntoRepository.create(data)
    }

    async updateTipo(id: number, data: ITipoAdjunto) {
        return await TipoAdjuntoRepository.update(id, data)
    }

    async updateEstado(id: number, estado: boolean) {
        return await TipoAdjuntoRepository.updateEstado(id, estado)
    }

    async deleteTipo(id: number) {
        return await TipoAdjuntoRepository.delete(id)
    }
}

export default new TipoAdjuntoService()