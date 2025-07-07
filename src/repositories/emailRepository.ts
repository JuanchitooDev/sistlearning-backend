import transporter from '../config/mailer'
import { IEmail } from "../interfaces/emailInterface"

class EmailRepository {
    async sendEmail({ to, subject, text, copyTo }: IEmail): Promise<any> {
        // const recipient = `juan.racchumi.dev@gmail.com`
        const recipients = copyTo ? [to, copyTo].join(',') : to
        console.log('recipients', recipients)

        const mailOptions = {
            from: process.env.EMAIL_USER_GMAIL,
            to: recipients,
            subject,
            text
        }

        try {
            const info = await transporter.sendMail(mailOptions)
            console.log('info mailer', info)
            return info
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            console.log('errorMessage', errorMessage)
        }
    }
}

export default new EmailRepository()