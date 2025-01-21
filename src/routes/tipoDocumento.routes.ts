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

// router.get('/', authToken, TipoDocumentoController.getTipos)
// router.get('/:id', authToken, TipoDocumentoController.getTipoById)
// router.get('/categoria/:categoria', authToken, TipoDocumentoController.getTiposPorCategoria)
// router.post('/', authToken, TipoDocumentoController.createTipo)
// router.put('/:id', authToken, TipoDocumentoController.updateTipo)
// router.delete('/:id', authToken, TipoDocumentoController.deleteTipo)

export default router