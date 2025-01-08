import { Router } from 'express'
import PersonaController from '../controllers/persona.controller'
import { authToken } from '../middleware/middleware'

const router = Router()

router.get('/', authToken, PersonaController.getPersonas)
router.get('/idtipo/:idtipodoc/numdoc/:numdoc', authToken, PersonaController.getPersonaByIdTipoAndNumDoc)
router.get('/:id', authToken, PersonaController.getPersonaById)
router.post('/', authToken, PersonaController.createPersona)
router.put('/:id', authToken, PersonaController.updatePersona)
router.delete('/:id', authToken, PersonaController.deletePersona)

export default router