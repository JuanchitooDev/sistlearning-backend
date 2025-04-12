import { Router } from 'express'
import MatriculaController from '@/controllers/matricula.controller'

const router = Router()

router.get('/', MatriculaController.getMatriculas)
router.get('/:id', MatriculaController.getMatriculaById)
router.post('/', MatriculaController.createMatricula)
router.put('/:id', MatriculaController.updateMatricula)
router.delete('/:id', MatriculaController.deleteMatricula)

export default router