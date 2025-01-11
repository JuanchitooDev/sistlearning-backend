import { Router } from 'express'
import CertificadoController from '../controllers/certificado.controller'
import { authToken } from '../middleware/authMiddleware'

const router = Router()

router.get('/', authToken, CertificadoController.getCertificados)
router.get('/:id', authToken, CertificadoController.getCertificadoById)
router.get('/codigo/:codigo', authToken, CertificadoController.getCertificadoByCodigo)
router.get('/:id/download', authToken, CertificadoController.downloadCertificado)
router.post('/', authToken, CertificadoController.createCertificado)
router.put('/:id', authToken, CertificadoController.updateCertificado)
router.delete('/:id', authToken, CertificadoController.deleteCertificado)

export default router