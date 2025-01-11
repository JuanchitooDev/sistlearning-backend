import { Router } from 'express'
import ContenidoController from '../controllers/contenido.controller'
import { authToken } from '../middleware/authMiddleware'

const router = Router()

router.get('/', authToken, ContenidoController.getContenidos)
router.get('/:id', authToken, ContenidoController.getContenidoById)
router.post('/', authToken, ContenidoController.createContenido)
router.put('/:id', authToken, ContenidoController.updateContenido)
router.delete('/:id', authToken, ContenidoController.deleteContenido)

export default router