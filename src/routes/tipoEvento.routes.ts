import { Router } from 'express'
import TipoEventoController from '../controllers/tipoEvento.controller'
import { authToken } from '../middleware/authMiddleware'

const router = Router()

router.get('/', authToken, TipoEventoController.getTipos)
router.get('/:id', authToken, TipoEventoController.getTipoPorId)
router.get('/nombre/:nombre', authToken, TipoEventoController.getTipoPorNombre)
router.post('/', authToken, TipoEventoController.createTipo)
router.put('/:id', authToken, TipoEventoController.updateTipo)
router.put('/cambiar-estado/:id', authToken, TipoEventoController.updateEstado)
router.delete('/:id', authToken, TipoEventoController.deleteTipo)

export default router