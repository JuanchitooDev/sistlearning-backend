import { Router } from 'express'
import EventoController from '../controllers/evento.controller'

const router = Router()

router.get('/', EventoController.getEventos)
router.get('/:id', EventoController.getEventoById)
router.post('/', EventoController.createEvento)
router.put('/:id', EventoController.updateEvento)
router.delete('/:id', EventoController.deleteEvento)

export default router