import { Router } from 'express'
import ProgramacionController from '../controllers/programacion.controller'

const router = Router()

router.get('/', ProgramacionController.getProgramaciones)
router.get('/:id', ProgramacionController.getProgramacionById)
router.post('/', ProgramacionController.createProgramacion)
router.put('/:id', ProgramacionController.updateProgramacion)
router.delete('/:id', ProgramacionController.deleteProgramacion)

export default router