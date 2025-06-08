import { Router } from 'express'
import DocumentoController from '@/controllers/documento.controller'
import { authToken } from '@/middleware/authMiddleware'

const router = Router()

// router.get('/infodoc/:idtipodoc/numdoc/:numdoc', DocumentoController.getDocumentoInfo)

router.get('/infodoc/:idtipodoc/numdoc/:numdoc', authToken, DocumentoController.getDocumentoInfo)

export default router