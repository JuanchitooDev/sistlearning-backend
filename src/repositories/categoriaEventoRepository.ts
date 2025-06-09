import CategoriaEvento from "../models/categoriaEvento.models"
import { ICategoriaEvento, CategoriaEventoResponse } from "../interfaces/categoriaEventoInterface"
import HString from "../helpers/HString"

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

            return { result: true, data: categorias, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
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

            return { result: true, data: categorias, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
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
                return { result: false, message: 'Categoría no encontrado', data: [], status: 200 }
            }

            return { result: true, message: 'Categoría encontrada', data: categoria, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async create(data: ICategoriaEvento): Promise<CategoriaEventoResponse> {
        try {
            data.nombre_url = HString.convertToUrlString(data.nombre as String)

            const newTipo = await CategoriaEvento.create(data as any)

            if (newTipo.id) {
                return { result: true, message: 'Categoría registrado con éxito', data: newTipo, status: 200 }
            }

            return { result: false, message: 'Error al registrar la categoría', data: [], status: 500 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async update(id: number, data: ICategoriaEvento): Promise<CategoriaEventoResponse> {
        try {
            if (data.nombre) {
                data.nombre_url = HString.convertToUrlString(data.nombre as String)
            }

            const categoria = await CategoriaEvento.findByPk(id)

            if (!categoria) {
                return { result: false, message: 'Categoría no encontrada', data: [], status: 200 }
            }

            const updatedCategoria = await categoria.update(data)

            return { result: true, message: 'Categoría actualizada con éxito', data: updatedCategoria, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async delete(id: number): Promise<CategoriaEventoResponse> {
        try {
            const categoria = await CategoriaEvento.findByPk(id);

            if (!categoria) {
                return { result: false, data: [], message: 'Categoría no encontrada', status: 200 };
            }

            await categoria.destroy();

            return { result: true, data: { id }, message: 'Categoría eliminada correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new CategoriaEventoRepository()