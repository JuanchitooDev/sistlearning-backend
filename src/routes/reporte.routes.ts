import { Router } from 'express'
import ReporteController from '../controllers/reporte.controller'
import { authToken } from '../middleware/authMiddleware'

const router = Router()

router.get('/alumnos-cumpleanios', authToken, ReporteController.listCumpleaniosExcel)

router.get('/alumnos', authToken, ReporteController.listAlumnosExcel)

router.get('/personas', authToken, ReporteController.listPersonasExcel)

export default router