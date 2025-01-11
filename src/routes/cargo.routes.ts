import { Router } from 'express'
import CargoController from '../controllers/cargo.controller'
import { authToken } from '../middleware/authMiddleware'

const router = Router()

router.get('/', authToken, CargoController.getCargos)
router.get('/:id', authToken, CargoController.getCargoById)
router.post('/', authToken, CargoController.createCargo)
router.put('/:id', authToken, CargoController.updateCargo)
router.delete('/:id', authToken, CargoController.deleteCargo)

export default router