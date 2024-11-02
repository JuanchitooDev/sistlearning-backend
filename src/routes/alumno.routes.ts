import { Router } from 'express'
import AlumnoController from '../controllers/alumno.controller'

const router = Router()

router.get('/', AlumnoController.getAlumnos)
router.get('/:id', AlumnoController.getAlumnoById)
router.post('/', AlumnoController.createAlumno)
router.put('/:id', AlumnoController.updateAlumno)
router.delete('/:id', AlumnoController.deleteAlumno)

export default router