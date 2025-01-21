import { Router } from 'express'
import CategoriaEventoController from '../controllers/categoriaEvento.controller'
// import { authToken } from '../middleware/authMiddleware'

const router = Router()

router.get('/', CategoriaEventoController.getCategorias)
router.get('/:id', CategoriaEventoController.getCategoriaById)
router.post('/', CategoriaEventoController.createCategoria)
router.put('/:id', CategoriaEventoController.updateCategoria)
router.delete('/:id', CategoriaEventoController.deleteCategoria)

// router.get('/', authToken, CategoriaEventoController.getCategorias)
// router.get('/:id', authToken, CategoriaEventoController.getCategoriaById)
// router.post('/', authToken, CategoriaEventoController.createCategoria)
// router.put('/:id', authToken, CategoriaEventoController.updateCategoria)
// router.delete('/:id', authToken, CategoriaEventoController.deleteCategoria)

export default router