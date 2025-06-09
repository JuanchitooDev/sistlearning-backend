import { Router } from 'express'
import EventoController from '../controllers/evento.controller'
import { authToken } from '../middleware/authMiddleware'

const router = Router()

router.get('/', authToken, EventoController.getEventos)
router.get('/:id', authToken, EventoController.getEventoPorId)
router.get('/titulo/:titulo', authToken, EventoController.getEventoPorTitulo)
router.post('/', authToken, EventoController.createEvento)
router.put('/:id', authToken, EventoController.updateEvento)
router.put('/cambiar-estado/:id', authToken, EventoController.updateEstado)
router.delete('/:id', authToken, EventoController.deleteEvento)

export default router