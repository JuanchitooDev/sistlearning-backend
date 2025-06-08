import EmailRepository from "@/repositories/emailRepository"
import { IAlumno } from "@/interfaces/alumnoInterface"

class EmailService {
    async sendAlumnoInscripcion(data: IAlumno) {
        return await EmailRepository.sendAlumnoInscripcionEmail(data)
    }
}

export default new EmailService()