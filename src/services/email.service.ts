import EmailRepository from "../repositories/emailRepository"
import { IEmail } from "../interfaces/emailInterface"

class EmailService {
    async sendEmail({ to, subject, text, copyTo }: IEmail) {
        return await EmailRepository.sendEmail({ to, subject, text, copyTo })
    }
}

export default new EmailService()