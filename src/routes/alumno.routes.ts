import { Router } from 'express'
import AlumnoController from '@/controllers/alumno.controller'
import { authToken } from '@/middleware/authMiddleware'

const router = Router()

// router.get('/', AlumnoController.getAlumnos)
// router.get('/:id', AlumnoController.getAlumnoById)
// router.post('/', AlumnoController.createAlumno)
// router.put('/:id', AlumnoController.updateAlumno)
// router.delete('/:id', AlumnoController.deleteAlumno)

router.get('/', authToken, AlumnoController.getAlumnos)
router.get('/:id', authToken, AlumnoController.getAlumnoPorId)
router.post('/', authToken, AlumnoController.createAlumno)
router.put('/:id', authToken, AlumnoController.updateAlumno)
router.delete('/:id', authToken, AlumnoController.deleteAlumno)

export default router