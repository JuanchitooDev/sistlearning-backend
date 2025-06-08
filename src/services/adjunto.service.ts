import { IAdjunto } from "@/interfaces/adjuntoInterface"
import AdjuntoRepository from "@/repositories/adjuntoRepository"
import { File } from 'node:buffer'

class AdjuntoService {
    async getAdjuntos() {
        return await AdjuntoRepository.getAll()
    }

    async getAdjuntosPorEstado(estado: boolean) {
        return await AdjuntoRepository.getAllByEstado(estado)
    }

    async getAdjuntoPorId(id: number) {
        return await AdjuntoRepository.getById(id)
    }

    async downloadPorId(id: number) {
        return await AdjuntoRepository.downloadById(id)
    }

    async getAdjuntosPorTipoAdjuntoEvento(idTipoAdjunto: number, idEvento: number) {
        return await AdjuntoRepository.getAllByTipoAdjuntoEvento(idTipoAdjunto, idEvento)
    }

    async createAdjunto(file: Express.Multer.File, id_evento: number, titulo: string) {
        console.log('file adjuntoService', file)
        const adjunto: IAdjunto = {
            id_evento,
            titulo,
            filename: file.filename,
            originalname: file.originalname,
            filepath: file.path,
            mimetype: file.mimetype,
            size: file.size
        }
        console.log('adjunto adjuntoService', adjunto)
        return await AdjuntoRepository.create(adjunto)
    }

    async updateAdjunto(id: number, data: IAdjunto) {
        return await AdjuntoRepository.update(id, data)
    }

    async updateEstado(id: number, estado: boolean) {
        return await AdjuntoRepository.updateEstado(id, estado)
    }

    async deleteAdjunto(id: number) {
        return await AdjuntoRepository.delete(id)
    }

    async upload(file: File) {
        const adjunto: IAdjunto = {
            filename: file.name,
            originalname: file.name,
            mimetype: file.type,
            size: file.size
        }
        return await AdjuntoRepository.create(adjunto)
    }
}

export default new AdjuntoService()