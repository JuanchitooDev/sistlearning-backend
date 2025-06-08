import { ICertificado } from "@/interfaces/certificadoInterface"
import CertificadoRepository from "@/repositories/certificadoRepository"

class CertificadoService {
    async getCertificados() {
        return await CertificadoRepository.getAll()
    }

    async getCertificadosPorAlumno(idAlumno?: number) {
        return await CertificadoRepository.getByAlumnoId(idAlumno)
    }

    async getCertificadoPorCodigo(codigo: string) {
        return await CertificadoRepository.getByCodigo(codigo)
    }

    async getCertificadoPorId(id: number) {
        return await CertificadoRepository.getById(id)
    }

    async downloadPorId(id: number) {
        return await CertificadoRepository.downloadById(id)
    }

    async createCertificado(data: ICertificado) {
        return await CertificadoRepository.create(data)
    }

    async updateCertificado(id: number, data: ICertificado) {
        return await CertificadoRepository.update(id, data)
    }

    async updateEstado(id: number, estado: boolean) {
        return await CertificadoRepository.updateEstado(id, estado)
    }

    async deleteCertificado(id: number) {
        return await CertificadoRepository.delete(id)
    }
}

export default new CertificadoService()