import CategoriaEvento from "@/models/categoriaEvento.models"
import { ICategoriaEvento, CategoriaEventoResponse } from "@/interfaces/categoriaEventoInterface"
import HString from "@/helpers/HString"

class CategoriaEventoRepository {
    async getAll(): Promise<CategoriaEventoResponse> {
        try {
            const categorias = await CategoriaEvento.findAll({
                attributes: [
                    'id',
                    'nombre',
                    'nombre_url',
                    'estado'
                ],
                order: [
                    ['id', 'DESC']
                ]
            })
            return { result: true, data: categorias }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage }
        }
    }

    async getAllByEstado(estado: boolean): Promise<CategoriaEventoResponse> {
        try {
            const categorias = await CategoriaEvento.findAll({
                where: {
                    activo: estado
                },
                attributes: [
                    'id',
                    'nombre',
                    'nombre_url',
                    'estado'
                ],
                order: [
                    ['id', 'DESC']
                ]
            })
            return { result: true, data: categorias }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async getById(id: number): Promise<CategoriaEventoResponse> {
        try {
            const categoria = await CategoriaEvento.findByPk(id, {
                attributes: [
                    'id',
                    'nombre',
                    'nombre_url',
                    'estado'
                ]
            })
            if (!categoria) {
                return { result: false, message: 'Categoría no encontrado' }
            }
            return { result: true, data: categoria }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async create(data: ICategoriaEvento): Promise<CategoriaEventoResponse> {
        try {
            data.nombre_url = HString.convertToUrlString(data.nombre as String)
            const newTipo = await CategoriaEvento.create(data as any)
            if (newTipo.id) {
                return { result: true, message: 'Categoría registrado con éxito', data: newTipo }
            } else {
                return { result: false, message: 'Error al registrar la categoría' }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async update(id: number, data: ICategoriaEvento): Promise<CategoriaEventoResponse> {
        try {
            if (data.nombre) {
                data.nombre_url = HString.convertToUrlString(data.nombre as String)
            }

            const categoria = await CategoriaEvento.findByPk(id)

            if (!categoria) {
                return { result: false, message: 'Categoría no encontrada' }
            }

            const updatedCategoria = await categoria.update(data)

            return { result: true, message: 'Categoría actualizada con éxito', data: updatedCategoria }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async delete(id: number): Promise<CategoriaEventoResponse> {
        try {
            const categoria = await CategoriaEvento.findByPk(id);
            if (!categoria) {
                return { result: false, message: 'Categoría no encontrada' };
            }
            await categoria.destroy();
            return { result: true, data: { id }, message: 'Categoría eliminada correctamente' };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage };
        }
    }
}

export default new CategoriaEventoRepository()