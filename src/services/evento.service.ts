import { IEvento } from "../interfaces/eventoInterface"
import EventoRepository from "../repositories/eventoRepository"

class EventoService {
    async getEventos() {
        return await EventoRepository.getAll()
    }

    async getEventosPorEstado(estado: boolean) {
        return await EventoRepository.getAllByEstado(estado)
    }

    async getEventoPorId(id: number) {
        return await EventoRepository.getById(id)
    }

    async getEventoPorTitulo(titulo: string) {
        return await EventoRepository.getByTitulo(titulo)
    }

    async createEvento(data: IEvento) {
        return await EventoRepository.create(data)
    }

    async updateEvento(id: number, data: IEvento) {
        return await EventoRepository.update(id, data)
    }

    async updateEstado(id: number, estado: boolean) {
        return await EventoRepository.updateEstado(id, estado)
    }

    async deleteEvento(id: number) {
        return await EventoRepository.delete(id)
    }
}

export default new EventoService()