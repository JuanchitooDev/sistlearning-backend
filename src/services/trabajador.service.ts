import { ITrabajador } from "@/interfaces/trabajadorInterface"
import TrabajadorRepository from "@/repositories/trabajadorRepository"

class TrabajadorService {
    async getTrabajadores() {
        return await TrabajadorRepository.getAll()
    }

    async getTrabajadoresPorEstado(estado: boolean) {
       return await TrabajadorRepository.getAllByEstado(estado)
    }

    async getTrabajadorPorId(id: number) {
        return await TrabajadorRepository.getById(id)
    }

    async getTrabajadorPorIdTipoDocNumDoc(idTipoDoc: number, numDoc: string) {
        return await TrabajadorRepository.getByTipoDocNumDoc(idTipoDoc, numDoc)
    }

    async getTrabajadorPorNumDoc(numDoc: string) {
        return await TrabajadorRepository.getByNumDoc(numDoc)
    }

    async createTrabajador(data: ITrabajador) {
        return await TrabajadorRepository.create(data)
    }

    async updateTrabajador(id: number, data: ITrabajador) {
        return await TrabajadorRepository.update(id, data)
    }

    async updateEstado(id: number, estado: boolean) {
        return await TrabajadorRepository.updateEstado(id, estado)
    }

    async deleteTrabajador(id: number) {
        return await TrabajadorRepository.delete(id)
    }
}

export default new TrabajadorService() 