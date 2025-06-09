import { Router } from 'express'
import InstructorController from '../controllers/instructor.controller'
import { authToken } from '../middleware/authMiddleware'

const router = Router()

router.get('/', authToken, InstructorController.getInstructores)
router.get('/:id', authToken, InstructorController.getInstructorPorId)
router.get('/tipo-documento/:idTipoDoc/numero-documento/:numDoc', authToken, InstructorController.getInstructorPorIdTipoDocNumDoc)
router.get('/numero-documento/:numDoc', InstructorController.getInstructorPorNumDoc)
router.post('/', authToken, InstructorController.createInstructor)
router.put('/:id', authToken, InstructorController.updateInstructor)
router.put('/cambiar-estado/:id', authToken, InstructorController.updateEstado)
router.delete('/:id', authToken, InstructorController.deleteInstructor)

export default router