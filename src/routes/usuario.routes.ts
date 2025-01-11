import { Router } from 'express'
import UsuarioController from '../controllers/usuario.controller'

const router = Router()

router.post('/', UsuarioController.getUsuarios)
router.post('/:id', UsuarioController.getUsuarioById)

export default router