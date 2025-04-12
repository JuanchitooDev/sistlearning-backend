import { IUsuario } from "@/interfaces/usuarioInterface"
import UsuarioRepository from "@/repositories/usuarioRepository"

class UsuarioService {
    async getUsuarios() {
        return await UsuarioRepository.getAll()
    }

    async getUsuarioPorId(id: number) {
        return await UsuarioRepository.getById(id)
    }

    async createUsuario(data: IUsuario) {
        return await UsuarioRepository.create(data)
    }
}

export default new UsuarioService()