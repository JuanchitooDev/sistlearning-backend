import { IContenido } from "@/interfaces/contenidoInterface"
import ContenidoRepository from "@/repositories/contenidoRepository"

class ContenidoService {
    async getContenidos() {
        return await ContenidoRepository.getAll()
    }

    async getContenidosPorEstado(estado: boolean) {
        return await ContenidoRepository.getAllByEstado(estado)
    }

    async getContenidoPorId(id: number) {
        return await ContenidoRepository.getById(id)
    }

    async createContenido(data: IContenido) {
        return await ContenidoRepository.create(data)
    }

    async updateContenido(id: number, data: IContenido) {
        return await ContenidoRepository.update(id, data)
    }

    async deleteContenido(id: number) {
        return await ContenidoRepository.delete(id)
    }
}

export default new ContenidoService()