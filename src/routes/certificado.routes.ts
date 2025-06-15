import { Router } from 'express'
import CertificadoController from '../controllers/certificado.controller'
// import { authToken } from '../middleware/authMiddleware'

const router = Router()

router.get('/codigo/:codigo', CertificadoController.getCertificadoPorCodigo)
router.get('/:id/download', CertificadoController.downloadCertificado)

router.get('/', CertificadoController.getCertificados)
router.get('/alumno', CertificadoController.getCertificadosPorAlumno)
router.get('/:id', CertificadoController.getCertificadoPorId)
router.post('/', CertificadoController.createCertificado)
router.put('/:id', CertificadoController.updateCertificado)
router.put('/cambiar-estado/:id', CertificadoController.updateEstado)
router.delete('/:id', CertificadoController.deleteCertificado)

router.post('/load-data', CertificadoController.loadData)

export default router