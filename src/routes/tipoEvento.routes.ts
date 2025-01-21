import { Router } from 'express'
import TipoEventoController from '../controllers/tipoEvento.controller'
// import { authToken } from '../middleware/authMiddleware'

const router = Router()

router.get('/', TipoEventoController.getTipos)
router.get('/:id', TipoEventoController.getTipoById)
router.post('/', TipoEventoController.createTipo)
router.put('/:id', TipoEventoController.updateTipo)
router.delete('/:id', TipoEventoController.deleteTipo)

export default router