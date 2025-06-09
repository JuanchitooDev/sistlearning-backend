import { IAlumno } from "../interfaces/alumnoInterface"
import AlumnoRepository from "../repositories/alumnoRepository"

class AlumnoService {
    async getAlumnos() {
        return await AlumnoRepository.getAll()
    }

    async getAlumnosPorEstado(estado: boolean) {
        return await AlumnoRepository.getAllByEstado(estado)
    }

    async getAlumnoPorId(id: number) {
        return await AlumnoRepository.getById(id)
    }

    async getAlumnoPorIdTipoDocNumDoc(idTipoDoc: number, numDoc: string) {
        return await AlumnoRepository.getByTipoDocNumDoc(idTipoDoc, numDoc)
    }

    async getAlumnoPorNumDoc(numDoc: string) {
        return await AlumnoRepository.getByNumDoc(numDoc)
    }

    async createAlumno(data: IAlumno) {
        return await AlumnoRepository.create(data)
    }

    async updateAlumno(id: number, data: IAlumno) {
        return await AlumnoRepository.update(id, data)
    }

    async updateEstado(id: number, estado: boolean) {
        return await AlumnoRepository.updateEstado(id, estado)
    }

    async deleteAlumno(id: number) {
        return await AlumnoRepository.delete(id)
    }
}

export default new AlumnoService() 