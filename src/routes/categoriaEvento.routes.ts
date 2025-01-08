import { Router } from 'express'
import CategoriaEventoController from '../controllers/categoriaEvento.controller'
import { authToken } from '../middleware/middleware'

const router = Router()

router.get('/', authToken, CategoriaEventoController.getCategorias)
router.get('/:id', authToken, CategoriaEventoController.getCategoriaById)
router.post('/', authToken, CategoriaEventoController.createCategoria)
router.put('/:id', authToken, CategoriaEventoController.updateCategoria)
router.delete('/:id', authToken, CategoriaEventoController.deleteCategoria)

export default router