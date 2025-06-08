import { IInstructor } from "@/interfaces/instructorInterface"
import InstructorRepository from "@/repositories/instructorRepository"

class InstructorService {
    async getInstructores() {
        return await InstructorRepository.getAll()
    }

    async getInstructoresPorEstado(estado: boolean) {
        return await InstructorRepository.getAllByEstado(estado)
    }

    async getInstructorPorId(id: number) {
        return await InstructorRepository.getById(id)
    }

    async getInstructorPorIdTipoDocNumDoc(idTipoDoc: number, numDoc: string) {
        return await InstructorRepository.getByTipoDocNumDoc(idTipoDoc, numDoc)
    }

    async getInstructorPorNumDoc(numDoc: string) {
        return await InstructorRepository.getByNumDoc(numDoc)
    }

    async createInstructor(data: IInstructor) {
        return await InstructorRepository.create(data)
    }

    async updateInstructor(id: number, data: IInstructor) {
        return await InstructorRepository.update(id, data)
    }

    async updateEstado(id: number, estado: boolean) {
        return await InstructorRepository.updateEstado(id, estado)
    }

    async deleteInstructor(id: number) {
        return await InstructorRepository.delete(id)
    }
}

export default new InstructorService() 