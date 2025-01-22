import { Router } from 'express'
import ReporteController from '../controllers/reporte.controller'
// import { authToken } from '../middleware/authMiddleware'

const router = Router()

router.get('/alumnos-cumpleanios', ReporteController.saveExcelFile)

// router.get('/alumnos-cumpleanios', authToken, ReporteController.getAllForBirthday)

export default router