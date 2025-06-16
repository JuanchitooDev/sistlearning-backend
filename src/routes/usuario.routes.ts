import { Router } from 'express'
import UsuarioController from '../controllers/usuario.controller'
import { authToken } from '../middleware/authMiddleware'

const router = Router()

router.get('/', authToken, UsuarioController.getUsuarios)
router.get('/:id', authToken, UsuarioController.getUsuarioPorId)
router.post('/', authToken, UsuarioController.createUsuario)
router.put('/:id', authToken, UsuarioController.updateUsuario)
router.put('/cambiar-estado/:id', authToken, UsuarioController.updateEstado)
router.delete('/:id', authToken, UsuarioController.deleteUsuario)

router.post('/load-data', UsuarioController.loadData)

export default router