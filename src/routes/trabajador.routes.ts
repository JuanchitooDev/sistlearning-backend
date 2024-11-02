import { Router } from 'express'
import TrabajadorController from '../controllers/trabajador.controller'

const router = Router()

router.get('/', TrabajadorController.getTrabajadores)
router.get('/:id', TrabajadorController.getTrabajadorById)
router.post('/', TrabajadorController.createTrabajador)
router.put('/:id', TrabajadorController.updateTrabajador)
router.delete('/:id', TrabajadorController.deleteTrabajador)

export default router