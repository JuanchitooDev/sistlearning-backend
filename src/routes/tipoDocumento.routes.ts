import { Router } from 'express'
import TipoDocumentoController from '../controllers/tipoDocumento.controller'
import { authToken } from '../middleware/authMiddleware'

const router = Router()

router.get('/', authToken, TipoDocumentoController.getTipos)
router.get('/:id', authToken, TipoDocumentoController.getTipoPorId)
router.get('/categoria/:categoria', authToken, TipoDocumentoController.getTiposPorCategoria)
router.post('/', authToken, TipoDocumentoController.createTipo)
router.put('/:id', authToken, TipoDocumentoController.updateTipo)
router.delete('/:id', authToken, TipoDocumentoController.deleteTipo)

export default router