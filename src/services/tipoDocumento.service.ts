import { ITipoDocumento } from "@/interfaces/tipoDocumentoInterface"
import TipoDocumentoRepository from "@/repositories/tipoDocumentoRepository"

class TipoDocumentoService {
    async getTipos() {
        return await TipoDocumentoRepository.getAll()
    }

    async getTiposPorEstado(estado: boolean) {
        return await TipoDocumentoRepository.getAllByEstado(estado)
    }

    async getTiposPorCategoria(categoria: string) {
        return await TipoDocumentoRepository.getAllByCategoria(categoria)
    }

    async getTipoPorId(id: number) {
        return await TipoDocumentoRepository.getById(id)
    }

    async createTipo(data: ITipoDocumento) {
        return await TipoDocumentoRepository.create(data)
    }

    async updateTipo(id: number, data: ITipoDocumento) {
        return await TipoDocumentoRepository.update(id, data)
    }

    async deleteTipo(id: number) {
        return await TipoDocumentoRepository.delete(id)
    }
}

export default new TipoDocumentoService()