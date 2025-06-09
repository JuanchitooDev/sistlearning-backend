import { ICategoriaEvento } from "../interfaces/categoriaEventoInterface"
import CategoriaEventoRepository from "../repositories/categoriaEventoRepository"

class CategoriaEventoService {
    async getCategorias() {
        return await CategoriaEventoRepository.getAll()
    }

    async getCategoriasPorEstado(estado: boolean) {
        return await CategoriaEventoRepository.getAllByEstado(estado)
    }

    async getCategoriaPorId(id: number) {
        return await CategoriaEventoRepository.getById(id)
    }

    async createCategoria(data: ICategoriaEvento) {
        return await CategoriaEventoRepository.create(data)
    }

    async updateCategoria(id: number, data: ICategoriaEvento) {
        return await CategoriaEventoRepository.update(id, data)
    }

    async deleteCategoria(id: number) {
        return await CategoriaEventoRepository.delete(id)
    }
}

export default new CategoriaEventoService()