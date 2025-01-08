import { Router } from 'express'
import UsuarioController from '../controllers/usuario.controller'

const router = Router()

router.post('/create', UsuarioController.createUsuario)
router.post('/login', UsuarioController.loginUsuario)
router.get('/verify', UsuarioController.verifyToken)

export default router