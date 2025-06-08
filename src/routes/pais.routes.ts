import { Router } from 'express'
import PaisController from '@/controllers/pais.controller'
import { authToken } from '@/middleware/authMiddleware'

const router = Router()

// router.get('/', PaisController.getPaises)
// router.get('/:id', PaisController.getPaisById)
// router.get('/categoria/:categoria', PaisController.getPaisesPorCategoria)
// router.post('/', PaisController.createPais)
// router.put('/:id', PaisController.updateOPais)
// router.delete('/:id', PaisController.deletePais)

router.get('/', authToken, PaisController.getPaises)
router.get('/:id', authToken, PaisController.getPaisPorId)
router.post('/', authToken, PaisController.createPais)
router.put('/:id', authToken, PaisController.updatePais)
router.put('/cambiar-estado/:id', authToken, PaisController.updateEstado)
router.delete('/:id', authToken, PaisController.deletePais)

export default router