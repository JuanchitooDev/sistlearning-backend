import { Router } from 'express'
import TrabajadorController from '@/controllers/trabajador.controller'
import { authToken } from '@/middleware/authMiddleware'

const router = Router()

// router.get('/', TrabajadorController.getTrabajadores)
// router.get('/:id', TrabajadorController.getTrabajadorById)
// router.post('/', TrabajadorController.createTrabajador)
// router.put('/:id', TrabajadorController.updateTrabajador)
// router.delete('/:id', TrabajadorController.deleteTrabajador)

router.get('/', authToken, TrabajadorController.getTrabajadores)
router.get('/:id', authToken, TrabajadorController.getTrabajadorPorId)
router.post('/', authToken, TrabajadorController.createTrabajador)
router.put('/:id', authToken, TrabajadorController.updateTrabajador)
router.delete('/:id', authToken, TrabajadorController.deleteTrabajador)

export default router