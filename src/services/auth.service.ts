import { IUsuario } from "@/interfaces/usuarioInterface"
import AuthRepository from "@/repositories/authRepository"

class AuthService {
    async login(data: IUsuario, userAgent: string) {
        return await AuthRepository.login(data, userAgent)
    }

    async logout(userId: number) {
        return await AuthRepository.logout(userId)
    }
}

export default new AuthService()