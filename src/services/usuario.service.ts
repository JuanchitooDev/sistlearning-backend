import { IUsuario } from "@/interfaces/usuarioInterface"
import UsuarioRepository from "@/repositories/usuarioRepository"

class UsuarioService {
    async getUsuarios() {
        return await UsuarioRepository.getAll()
    }

    async getUsuariosPorEstado(estado: boolean) {
        return await UsuarioRepository.getAllByEstado(estado)
    }

    async getUsuarioPorId(id: number) {
        return await UsuarioRepository.getById(id)
    }

    async createUsuario(data: IUsuario) {
        return await UsuarioRepository.create(data)
    }

    async updateUsuario(id: number, data: IUsuario) {
        return await UsuarioRepository.update(id, data)
    }

    async updateEstado(id: number, estado: boolean) {
        return await UsuarioRepository.updateEstado(id, estado)
    }

    async deleteUsuario(id: number) {
        return await UsuarioRepository.delete(id)
    }
}

export default new UsuarioService()