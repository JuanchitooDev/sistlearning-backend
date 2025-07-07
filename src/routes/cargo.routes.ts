import { Router } from 'express'
import CargoController from '../controllers/cargo.controller'
import { authToken } from '../middleware/authMiddleware'

const router = Router()

router.get('/', authToken, CargoController.getCargos)
router.get('/:id', authToken, CargoController.getCargoPorId)
router.get('/nombre/:nombre', authToken, CargoController.getCargoPorNombre)
router.post('/', authToken, CargoController.createCargo)
router.put('/:id', authToken, CargoController.updateCargo)
router.put('/cambiar-estado/:id', authToken, CargoController.updateEstado)
router.delete('/:id', authToken, CargoController.deleteCargo)

export default router