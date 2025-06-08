import { Router } from 'express'
import TipoAdjuntoController from '@/controllers/tipoAdjunto.controller'
import { authToken } from '@/middleware/authMiddleware'

const router = Router()

// router.get('/', TipoAdjuntoController.getTipos)
// router.get('/:id', TipoAdjuntoController.getTipoById)
// router.post('/', TipoAdjuntoController.createTipo)
// router.put('/:id', TipoAdjuntoController.updateTipo)
// router.delete('/:id', TipoAdjuntoController.deleteTipo)

router.get('/', authToken, TipoAdjuntoController.getTipos)
router.get('/:id', authToken, TipoAdjuntoController.getTipoPorId)
router.post('/', authToken, TipoAdjuntoController.createTipo)
router.put('/:id', authToken, TipoAdjuntoController.updateTipo)
router.put('/cambiar-estado/:id', authToken, TipoAdjuntoController.updateEstado)
router.delete('/:id', authToken, TipoAdjuntoController.deleteTipo)

export default router