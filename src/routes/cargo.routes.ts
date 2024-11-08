import { Router } from 'express'
import CargoController from '../controllers/cargo.controller'

const router = Router()

router.get('/', CargoController.getCargos)
router.get('/:id', CargoController.getCargoById)
router.post('/', CargoController.createCargo)
router.put('/:id', CargoController.updateCargo)
router.delete('/:id', CargoController.deleteCargo)

export default router