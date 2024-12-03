import { Router } from 'express'
import CategoriaEventoController from '../controllers/categoriaEvento.controller'

const router = Router()

router.get('/', CategoriaEventoController.getCategorias)
router.get('/:id', CategoriaEventoController.getCategoriaById)
router.post('/', CategoriaEventoController.createCategoria)
router.put('/:id', CategoriaEventoController.updateCategoria)
router.delete('/:id', CategoriaEventoController.deleteCategoria)

export default router