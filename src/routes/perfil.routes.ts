import { Router } from 'express'
import PerfilController from '../controllers/perfil.controller'
// import { authToken } from '../middleware/authMiddleware'

const router = Router()

router.get('/', PerfilController.getPerfiles)
router.get('/:id', PerfilController.getPerfilById)
router.post('/', PerfilController.createPerfil)
router.put('/:id', PerfilController.updatePerfil)
router.delete('/:id', PerfilController.deletePerfil)

export default router