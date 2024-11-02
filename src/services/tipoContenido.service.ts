import TipoContenido from '../models/tipoContenido.models'
import { ITipoContenido, TipoContenidoResponse } from '../interfaces/tipoContenidoInterface'

class TipoContenidoService {
    async getTipos(): Promise<TipoContenidoResponse> {
        try {
            const tipos = await TipoContenido.findAll()
            return { result: true, data: tipos }
        } catch (error) {
            // const msg = `Error al obtener los tipos de contenidos: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async getTipoById(id: number): Promise<TipoContenidoResponse> {
        try {
            const tipo = await TipoContenido.findByPk(id)
            if (!tipo) {
                return { result: false, error: 'Tipo de contenido no encontrado' }
            }
            return { result: true, data: tipo }
        } catch (error) {
            // const msg = `Error al obtener el tipo de contenido: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async createTipo(data: ITipoContenido): Promise<TipoContenidoResponse> {
        try {
            const newTipo = await TipoContenido.create(data as any)
            return { result: true, data: newTipo }
        } catch (error) {
            // const msg = `Error al crear el tipo de contenido: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async updateTipo(id: number, data: ITipoContenido): Promise<TipoContenidoResponse> {
        try {
            const tipo = await TipoContenido.findByPk(id)
            if (!tipo) {
                return { result: false, error: 'Tipo de contenido no encontrado' }
            }
            const updatedTipo = await tipo.update(data)
            return { result: true, data: updatedTipo }
        } catch (error) {
            // const msg = `Error al actualizar el tipo de contenido: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async deleteTipo(id: number): Promise<TipoContenidoResponse> {
        try {
            const tipo = await TipoContenido.findByPk(id);
            if (!tipo) {
                return { result: false, error: 'Tipo de contenido no encontrado' };
            }
            await tipo.destroy();
            return { result: true, data: { id } };
        } catch (error) {
            // const msg = `Error al eliminar el tipo de contenido: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg };
        }
    }
}

export default new TipoContenidoService() 