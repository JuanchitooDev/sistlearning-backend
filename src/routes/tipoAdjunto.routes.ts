import { Router } from 'express'
import TipoAdjuntoController from '../controllers/tipoAdjunto.controller'
import { authToken } from '../middleware/authMiddleware'

const router = Router()

router.get('/', authToken, TipoAdjuntoController.getTipos)
router.get('/:id', authToken, TipoAdjuntoController.getTipoPorId)
router.post('/', authToken, TipoAdjuntoController.createTipo)
router.put('/:id', authToken, TipoAdjuntoController.updateTipo)
router.put('/cambiar-estado/:id', authToken, TipoAdjuntoController.updateEstado)
router.delete('/:id', authToken, TipoAdjuntoController.deleteTipo)

export default router