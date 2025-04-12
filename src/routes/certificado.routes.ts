import { Router } from 'express'
import CertificadoController from '@/controllers/certificado.controller'
import { authToken } from '@/middleware/authMiddleware'

const router = Router()

router.get('/codigo/:codigo', CertificadoController.getCertificadoPorCodigo)
router.get('/:id/download', CertificadoController.downloadCertificado)

router.get('/', authToken, CertificadoController.getCertificados)
router.get('/:id', authToken, CertificadoController.getCertificadoPorId)
router.post('/', authToken, CertificadoController.createCertificado)
router.put('/:id', authToken, CertificadoController.updateCertificado)
router.delete('/:id', authToken, CertificadoController.deleteCertificado)

export default router