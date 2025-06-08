import { ICargo } from "@/interfaces/cargoInterface"
import CargoRepository from "@/repositories/cargoRepository"

class CargoService {
    async getCargos() {
        return await CargoRepository.getAll()
    }

    async gerCargosPorEstado(estado: boolean) {
        return await CargoRepository.getAllByEstado(estado)
    }

    async getCargoPorId(id: number) {
        return await CargoRepository.getById(id)
    }

    async getCargosPorNombre(nombre: string) {
        return await CargoRepository.getByNombre(nombre)
    }

    async createCargo(data: ICargo) {
        return await CargoRepository.create(data)
    }

    async updateCargo(id: number, data: ICargo) {
        return await CargoRepository.update(id, data)
    }

    async updateEstado(id: number, estado: boolean) {
        return await CargoRepository.updateEstado(id, estado)
    }

    async deleteCargo(id: number) {
        return await CargoRepository.delete(id)
    }
}

export default new CargoService() 