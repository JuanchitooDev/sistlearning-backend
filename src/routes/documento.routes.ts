import { Router } from 'express'
import DocumentoController from '../controllers/documento.controller'

const router = Router()

router.get('/infodoc/:idtipodoc/numdoc/:numdoc', DocumentoController.getDocumentoInfo)

export default router