import TipoContenido from '../models/tipoContenido.models'
import { ITipoContenido, TipoContenidoResponse } from '../interfaces/tipoContenidoInterface'

class TipoContenidoService {
    async getTipos(): Promise<TipoContenidoResponse> {
        try {
            const tipos = await TipoContenido.findAll({
                attributes: [
                    'id', 'nombre', 'estado'
                ]
            })
            return { result: true, data: tipos }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async getTipoById(id: number): Promise<TipoContenidoResponse> {
        try {
            const tipo = await TipoContenido.findByPk(id, {
                attributes: [
                    'id', 'nombre', 'estado'
                ]
            })
            if (!tipo) {
                return { result: false, message: 'Tipo de contenido no encontrado' }
            }
            return { result: true, data: tipo }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async createTipo(data: ITipoContenido): Promise<TipoContenidoResponse> {
        try {
            const newTipo = await TipoContenido.create(data as any)
            if (newTipo.id) {
                return { result: true, message: 'Tipo de contenido registrado con éxito', data: newTipo }
            } else {
                return { result: false, message: 'Error al registrar el tipo de contenido' }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async updateTipo(id: number, data: ITipoContenido): Promise<TipoContenidoResponse> {
        try {
            const tipo = await TipoContenido.findByPk(id)

            if (!tipo) {
                return { result: false, message: 'Tipo de contenido no encontrado' }
            }

            const updatedTipo = await tipo.update(data)
            return { result: true, message: 'Tipo de contenido actualizado con éxito', data: updatedTipo }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async deleteTipo(id: number): Promise<TipoContenidoResponse> {
        try {
            const tipo = await TipoContenido.findByPk(id);
            if (!tipo) {
                return { result: false, message: 'Tipo de contenido no encontrado' };
            }
            await tipo.destroy();
            return { result: true, data: { id }, message: 'Tipo de contenido eliminado correctamente' };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage };
        }
    }
}

export default new TipoContenidoService() 