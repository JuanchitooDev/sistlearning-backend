import { Router } from 'express'
import GrupoAdjuntoController from '../controllers/grupoAdjunto.controller'
import { authToken } from '../middleware/authMiddleware'

const router = Router()

router.get('/', authToken, GrupoAdjuntoController.getGrupos)
router.get('/:id', authToken, GrupoAdjuntoController.getGrupoPorId)
router.post('/', authToken, GrupoAdjuntoController.createGrupo)
router.put('/:id', authToken, GrupoAdjuntoController.updateGrupo)
router.put('/cambiar-estado/:id', authToken, GrupoAdjuntoController.updateEstado)
router.delete('/:id', authToken, GrupoAdjuntoController.deleteGrupo)

export default router