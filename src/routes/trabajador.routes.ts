import { Router } from 'express'
import TrabajadorController from '../controllers/trabajador.controller'
import { authToken } from '../middleware/authMiddleware'

const router = Router()

router.get('/', authToken, TrabajadorController.getTrabajadores)
router.get('/:id', authToken, TrabajadorController.getTrabajadorPorId)
router.get('/tipo-documento/:idTipoDoc/numero-documento/:numDoc', authToken, TrabajadorController.getTrabajadorPorIdTipoDocNumDoc)
router.get('/numero-documento/:numDoc', TrabajadorController.getTrabajadorPorNumDoc)
router.post('/', authToken, TrabajadorController.createTrabajador)
router.put('/:id', authToken, TrabajadorController.updateTrabajador)
router.put('/cambiar-estado/:id', authToken, TrabajadorController.updateEstado)
router.delete('/:id', authToken, TrabajadorController.deleteTrabajador)

export default router