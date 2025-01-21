import { Router } from 'express'
import ContenidoController from '../controllers/contenido.controller'
// import { authToken } from '../middleware/authMiddleware'

const router = Router()

router.get('/', ContenidoController.getContenidos)
router.get('/:id', ContenidoController.getContenidoById)
router.post('/', ContenidoController.createContenido)
router.put('/:id', ContenidoController.updateContenido)
router.delete('/:id', ContenidoController.deleteContenido)

export default router