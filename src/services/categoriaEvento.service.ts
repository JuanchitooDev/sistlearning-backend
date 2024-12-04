import CategoriaEvento from '../models/categoriaEvento.models'
import { ICategoriaEvento, CategoriaEventoResponse } from '../interfaces/categoriaEventoInterface'
import HString from '../helpers/HString';

class CategoriaEventoService {
    async getCategorias(): Promise<CategoriaEventoResponse> {
        try {
            const categorias = await CategoriaEvento.findAll({
                attributes: [
                    'id', 'nombre', 'nombre_url', 'estado'
                ]
            })
            return { result: true, data: categorias }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async getCategoriasPorEstado(estado: boolean): Promise<CategoriaEventoResponse> {
        try {
            const categorias = await CategoriaEvento.findAll({
                where: {
                    activo: estado
                },
                attributes: [
                    'id', 'nombre', 'nombre_url', 'estado'
                ]
            })
            return { result: true, data: categorias }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async getCategoriaById(id: number): Promise<CategoriaEventoResponse> {
        try {
            const categoria = await CategoriaEvento.findByPk(id, {
                attributes: [
                    'id', 'nombre', 'nombre_url', 'estado'
                ]
            })
            if (!categoria) {
                return { result: false, message: 'Categoría de evento no encontrado' }
            }
            return { result: true, data: categoria }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async createCategoria(data: ICategoriaEvento): Promise<CategoriaEventoResponse> {
        try {
            data.nombre_url = HString.convertToUrlString(data.nombre as String)
            const newCategoria = await CategoriaEvento.create(data as any)
            if (newCategoria.id) {
                return { result: true, message: 'Categoría de evento registrado con éxito', data: newCategoria }
            } else {
                return { result: false, message: 'Error al registrar la categoría de evento' }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async updateCategoria(id: number, data: ICategoriaEvento): Promise<CategoriaEventoResponse> {
        try {
            if (data.nombre) {
                data.nombre_url = HString.convertToUrlString(data.nombre as String)
            }
            
            const categoria = await CategoriaEvento.findByPk(id)
            
            if (!categoria) {
                return { result: false, message: 'Categoría de evento no encontrado' }
            }
            
            const updatedCategoria = await categoria.update(data)
            
            return { result: true, message: 'Categoría de evento actualizado con éxito', data: updatedCategoria }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async deleteCategoria(id: number): Promise<CategoriaEventoResponse> {
        try {
            const categoria = await CategoriaEvento.findByPk(id);
            if (!categoria) {
                return { result: false, message: 'Categoría de evento no encontrado' };
            }
            await categoria.destroy();
            return { result: true, data: { id }, message: 'Categoría de evento eliminado correctamente' };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage };
        }
    }
}

export default new CategoriaEventoService()