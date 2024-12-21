import { Router } from 'express'
import TipoEventoController from '../controllers/tipoEvento.controller'

const router = Router()

// /**
//  * @swagger
//  * /tipo-evento:
//  *   get:
//  *     summary: Obtener todos los tipo de eventos
//  *     description: Obtiene una lista de todos los tipo de eventos
//  *     responses:
//  *       200:
//  *         description: Lista de tipo de eventos
//  *         content:
//  *           application/json
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: Object
//  *                 properties:
//  *                   id:
//  *                     type: integer
//  *                    nombre:
//  *                      type: string
//  */
router.get('/', TipoEventoController.getTipos)

// /**
//  * @swagger
//  * /tipo-evento/id:
//  *   get:
//  *     summary: Obtener un tipo de evento
//  *     description: Obtiene un tipo de evento de una lista
//  *     responses:
//  *       200:
//  *         description: Tipo de evento
//  *         content:
//  *           application/json
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: Object
//  *                 properties:
//  *                   id:
//  *                     type: integer
//  *                    nombre:
//  *                      type: string
//  */
router.get('/:id', TipoEventoController.getTipoById)
router.post('/', TipoEventoController.createTipo)
router.put('/:id', TipoEventoController.updateTipo)
router.delete('/:id', TipoEventoController.deleteTipo)

export default router