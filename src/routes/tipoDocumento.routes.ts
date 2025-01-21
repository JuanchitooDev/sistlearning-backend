import { Router } from 'express'
import TipoDocumentoController from '../controllers/tipoDocumento.controller'
// import { authToken } from '../middleware/authMiddleware'

const router = Router()

router.get('/', TipoDocumentoController.getTipos)
router.get('/:id', TipoDocumentoController.getTipoById)
router.get('/categoria/:categoria', TipoDocumentoController.getTiposPorCategoria)
router.post('/', TipoDocumentoController.createTipo)
router.put('/:id', TipoDocumentoController.updateTipo)
router.delete('/:id', TipoDocumentoController.deleteTipo)

export default router