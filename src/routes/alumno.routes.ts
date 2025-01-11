import { Router } from 'express'
import AlumnoController from '../controllers/alumno.controller'
import { authToken } from '../middleware/authMiddleware'

const router = Router()

router.get('/', authToken, AlumnoController.getAlumnos)
router.get('/:id', authToken, AlumnoController.getAlumnoById)
router.post('/', authToken, AlumnoController.createAlumno)
router.put('/:id', authToken, AlumnoController.updateAlumno)
router.delete('/:id', authToken, AlumnoController.deleteAlumno)
router.get('/cumpleanios/excel', authToken, AlumnoController.getCumpleanios)

export default router