import { Router } from 'express'
import PerfilController from '../controllers/perfil.controller'
// import { authToken } from '../middleware/authMiddleware'

const router = Router()

router.get('/', PerfilController.getPerfiles)
router.get('/:id', PerfilController.getPerfilById)
router.post('/', PerfilController.createPerfil)
router.put('/:id', PerfilController.updatePerfil)
router.delete('/:id', PerfilController.deletePerfil)

// router.get('/', authToken, PerfilController.getPerfiles)
// router.get('/:id', authToken, PerfilController.getPerfilById)
// router.post('/', authToken, PerfilController.createPerfil)
// router.put('/:id', authToken, PerfilController.updatePerfil)
// router.delete('/:id', authToken, PerfilController.deletePerfil)

export default router