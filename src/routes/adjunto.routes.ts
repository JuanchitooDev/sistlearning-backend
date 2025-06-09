import { Router } from 'express'
import AdjuntoController from '../controllers/adjunto.controller'
import { authToken } from '../middleware/authMiddleware'
import upload from '../middleware/uploadMiddleware'

const router = Router()

router.get('/', authToken, AdjuntoController.getAdjuntos)
router.get('/:id', authToken, AdjuntoController.getAdjuntoPorId)
router.get('/tipo-contenido/:idTipoContenido/evento/:idEvento', AdjuntoController.getAdjuntosPorTipoAdjuntoEvento)
router.post('/upload', authToken, upload.single('file'), AdjuntoController.createAdjunto)
router.put('/:id', authToken, AdjuntoController.updateAdjunto)
router.put('/cambiar-estado/:id', authToken, AdjuntoController.updateEstado)
router.delete('/:id', authToken, AdjuntoController.deleteAdjunto)

export default router