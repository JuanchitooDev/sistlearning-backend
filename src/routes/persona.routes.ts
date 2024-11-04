import { Router } from 'express'
import PersonaController from '../controllers/persona.controller'

const router = Router()

router.get('/', PersonaController.getPersonas)
router.get('/idtipo/:idtipodoc/numdoc/:numdoc', PersonaController.getPersonaByIdTipoAndNumDoc)
router.get('/:id', PersonaController.getPersonaById)
router.post('/', PersonaController.createPersona)
router.put('/:id', PersonaController.updatePersona)
router.delete('/:id', PersonaController.deletePersona)

export default router