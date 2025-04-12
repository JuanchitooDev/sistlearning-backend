import { Router } from 'express'
import UsuarioController from '@/controllers/usuario.controller'

const router = Router()

router.get('/', UsuarioController.getUsuarios)
router.get('/:id', UsuarioController.getUsuarioPorId)
router.post('/', UsuarioController.createUsuario)

export default router