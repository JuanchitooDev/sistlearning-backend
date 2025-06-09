import { Router } from 'express'
import EmpresaController from '../controllers/empresa.controller'

const router = Router()

router.get('/', EmpresaController.getEmpresas)
router.get('/:id', EmpresaController.getEmpresaById)
router.post('/', EmpresaController.createEmpresa)
router.put('/:id', EmpresaController.updateEmpresa)
router.delete('/:id', EmpresaController.deleteEmpresa)

export default router