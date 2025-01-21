import { Router } from 'express'
import TipoContenidoController from '../controllers/tipoContenido.controller'
// import { authToken } from '../middleware/authMiddleware'

const router = Router()

router.get('/', TipoContenidoController.getTipos)
router.get('/:id', TipoContenidoController.getTipoById)
router.post('/', TipoContenidoController.createTipo)
router.put('/:id', TipoContenidoController.updateTipo)
router.delete('/:id', TipoContenidoController.deleteTipo)

export default router