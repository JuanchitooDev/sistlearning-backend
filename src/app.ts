import express from 'express'
import cors from 'cors'
import path from 'path'

import alumnoRoutes from './routes/alumno.routes'
import tipoDocumentoRoutes from './routes/tipoDocumento.routes'
import tipoEventoRoutes from './routes/tipoEvento.routes'
import categoriaEventoRoutes from './routes/categoriaEvento.routes'
import tipoAdjuntoRoutes from './routes/tipoAdjunto.routes'
import grupoAdjuntoRoutes from './routes/grupoAdjunto.routes'
import perfilRoutes from './routes/perfil.routes'
import trabajadorRoutes from './routes/trabajador.routes'
import empresaRoutes from './routes/empresa.routes'
import eventoRoutes from './routes/evento.routes'
import certificadoRoutes from './routes/certificado.routes'
import adjuntoRoutes from './routes/adjunto.routes'
import authRoutes from './routes/auth.routes'
import cargoRoutes from './routes/cargo.routes'
import documentoRoutes from './routes/documento.routes'
import personaRoutes from './routes/persona.routes'
import usuarioRoutes from './routes/usuario.routes'
import reporteRoutes from './routes/reporte.routes'
import instructorRoutes from './routes/instructor.routes'
import paisRoutes from './routes/pais.routes'

const app = express()

const allowedOrigin = process.env.CORS_ALLOWED_ORIGIN || '*'

app.use(cors({
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use('/uploads', express.static('src/uploads'))

app.use(express.json())

app.use('/img', express.static(path.join(path.resolve(), 'public/img')))

app.use('/api/alumno', alumnoRoutes)
app.use('/api/tipo-documento', tipoDocumentoRoutes)
app.use('/api/tipo-evento', tipoEventoRoutes)
app.use('/api/categoria-evento', categoriaEventoRoutes)
app.use('/api/tipo-adjunto', tipoAdjuntoRoutes)
app.use('/api/grupo-adjunto', grupoAdjuntoRoutes)
app.use('/api/perfil', perfilRoutes)
app.use('/api/trabajador', trabajadorRoutes)
app.use('/api/empresa', empresaRoutes)
app.use('/api/evento', eventoRoutes)
app.use('/api/certificado', certificadoRoutes)
app.use('/api/adjunto', adjuntoRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/cargo', cargoRoutes)
app.use('/api/documento', documentoRoutes)
app.use('/api/persona', personaRoutes)
app.use('/api/usuario', usuarioRoutes)
app.use('/api/reporte', reporteRoutes)
app.use('/api/instructor', instructorRoutes)
app.use('/api/pais', paisRoutes)

export default app;