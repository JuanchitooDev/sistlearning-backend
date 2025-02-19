import { Router } from 'express'
import EventoController from '../controllers/evento.controller'
// import { authToken } from '../middleware/authMiddleware'

const router = Router()

router.get('/', EventoController.getEventos)
router.get('/:id', EventoController.getEventoById)
router.post('/', EventoController.createEvento)
router.put('/:id', EventoController.updateEvento)
router.delete('/:id', EventoController.deleteEvento)

// router.get('/', authToken, EventoController.getEventos)
// router.get('/:id', authToken, EventoController.getEventoById)
// router.post('/', authToken, EventoController.createEvento)
// router.put('/:id', authToken, EventoController.updateEvento)
// router.delete('/:id', authToken, EventoController.deleteEvento)

export default router