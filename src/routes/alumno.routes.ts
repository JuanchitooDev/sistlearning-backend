import { Router } from 'express'
import AlumnoController from '../controllers/alumno.controller'
import { authToken } from '../middleware/authMiddleware'

const router = Router()

router.get('/', authToken, AlumnoController.getAlumnos)
router.get('/:id', authToken, AlumnoController.getAlumnoPorId)
router.get('/tipo-documento/:idTipoDoc/numero-documento/:numDoc', authToken, AlumnoController.getAlumnoPorIdTipoDocNumDoc)
router.get('/numero-documento/:numDoc', AlumnoController.getAlumnoPorNumDoc)
router.post('/', authToken, AlumnoController.createAlumno)
router.put('/:id', authToken, AlumnoController.updateAlumno)
router.put('/cambiar-estado/:id', authToken, AlumnoController.updateEstado)
router.delete('/:id', authToken, AlumnoController.deleteAlumno)

router.post('/load-data', AlumnoController.loadData)

export default router