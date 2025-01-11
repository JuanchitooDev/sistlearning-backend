import jwt, { TokenExpiredError } from 'jsonwebtoken'
import dotenv from 'dotenv'

const authToken = (req: any, res: any, next: any) => {
    try {
        dotenv.config()
        
        const token = req.headers['authorization']?.split(' ')[1]

        console.log('obteniendo token', token)

        if (!token) return res.status(401).json({ message: 'No se encontró token, acceso no autorizado' })
            
        jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
            if (err) return res.status(401).json({ message: 'Token no válido' })
            req.user = decoded
            next()
        })
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return next('Token expirado, por favor inicie sesión nuevamente')
        }
        return next('Token inválido')
    }
}

export { authToken }