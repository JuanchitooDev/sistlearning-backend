import { IAuth } from "../interfaces/authInterface"
import AuthRepository from "../repositories/authRepository"

class AuthService {
    async login(data: IAuth) {
        return await AuthRepository.login(data)
    }

    async logout(userId: number) {
        return await AuthRepository.logout(userId)
    }
}

export default new AuthService()