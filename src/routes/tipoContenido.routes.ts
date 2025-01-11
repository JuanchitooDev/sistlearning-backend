import { Router } from 'express'
import TipoContenidoController from '../controllers/tipoContenido.controller'
import { authToken } from '../middleware/authMiddleware'

const router = Router()

router.get('/', authToken, TipoContenidoController.getTipos)
router.get('/:id', authToken, TipoContenidoController.getTipoById)
router.post('/', authToken, TipoContenidoController.createTipo)
router.put('/:id', authToken, TipoContenidoController.updateTipo)
router.delete('/:id', authToken, TipoContenidoController.deleteTipo)

export default router