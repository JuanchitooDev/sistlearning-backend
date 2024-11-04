import { Router } from 'express'
import CertificadoController from '../controllers/certificado.controller'

const router = Router()

router.get('/', CertificadoController.getCertificados)
router.get('/:codigo', CertificadoController.getCertificadoByCodigo)
router.get('/:id/download', CertificadoController.downloadCertificado)
router.post('/', CertificadoController.createCertificado)
router.put('/:id', CertificadoController.updateCertificado)
router.delete('/:id', CertificadoController.deleteCertificado)

export default router