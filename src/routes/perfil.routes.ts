import { Router } from 'express'
import PerfilController from '../controllers/perfil.controller'
import { authToken } from '../middleware/authMiddleware'

const router = Router()

router.get('/', authToken, PerfilController.getPerfiles)
router.get('/:id', authToken, PerfilController.getPerfilPorId)
router.post('/', authToken, PerfilController.createPerfil)
router.put('/:id', authToken, PerfilController.updatePerfil)
router.put('/cambiar-estado/:id', authToken, PerfilController.updateEstado)
router.delete('/:id', authToken, PerfilController.deletePerfil)

export default router