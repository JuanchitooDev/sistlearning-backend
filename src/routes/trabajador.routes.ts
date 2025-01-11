import { Router } from 'express'
import TrabajadorController from '../controllers/trabajador.controller'
import { authToken } from '../middleware/authMiddleware'

const router = Router()

router.get('/', authToken, TrabajadorController.getTrabajadores)
router.get('/:id', authToken, TrabajadorController.getTrabajadorById)
router.post('/', authToken, TrabajadorController.createTrabajador)
router.put('/:id', authToken, TrabajadorController.updateTrabajador)
router.delete('/:id', authToken, TrabajadorController.deleteTrabajador)

export default router