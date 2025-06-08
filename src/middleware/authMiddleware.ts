import jwt, { TokenExpiredError } from 'jsonwebtoken'
import dotenv from 'dotenv'

const authToken = (req: any, res: any, next: any) => {
    try {
        dotenv.config()

        // console.log('req.headers', req.headers)

        // const token = req.headers['authorization']?.split(' ')[1]
        const authHeader = req.headers['authorization']

        const token = authHeader && authHeader.split(' ')[1]

        // console.log('obteniendo token', token)

        if (!token) return res.status(401).json({ message: 'Token no proporcionado' })

        jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ message: 'Token expirado' })
                }
                return res.status(401).json({ message: 'Token inválido' })
            }
            req.user = decoded
            next()
        })

        // const user = jwt.verify(token, process.env.JWT_SECRET as string)
        // req.user = user
        // next()

        // jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
        //     if (err) return res.status(401).json({ message: 'Token no válido' })
        //     req.user = decoded
        //     next()
        // })
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return next('Token expirado, por favor inicie sesión nuevamente')
        }
        return next('Token no válido')
    }
}

export { authToken }