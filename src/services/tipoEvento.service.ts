import TipoEvento from '../models/tipoEvento.models'
import { ITipoEvento, TipoEventoResponse } from '../interfaces/tipoEventoInterface'
import HString from '../helpers/HString';

class TipoEventoService {
    async getTipos(): Promise<TipoEventoResponse> {
        try {
            const tipos = await TipoEvento.findAll()
            return { result: true, data: tipos }
        } catch (error) {
            // const msg = `Error al obtener los tipos de eventos: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async getTiposPorEstado(estado: boolean): Promise<TipoEventoResponse>{
        try {
            const tipos = await TipoEvento.findAll({
                where: {
                    activo: estado
                }
            })
            return { result: true, data: tipos }
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async getTipoById(id: number): Promise<TipoEventoResponse> {
        try {
            const tipo = await TipoEvento.findByPk(id)
            if (!tipo) {
                return { result: false, error: 'Tipo de evento no encontrado' }
            }
            return { result: true, data: tipo }
        } catch (error) {
            // const msg = `Error al obtener el tipo de evento: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async createTipo(data: ITipoEvento): Promise<TipoEventoResponse> {
        try {
            data.nombre_url = HString.convertToUrlString(data.nombre as String)
            const newTipo = await TipoEvento.create(data as any)
            return { result: true, data: newTipo }
        } catch (error) {
            // const msg = `Error al crear el tipo de evento: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async updateTipo(id: number, data: ITipoEvento): Promise<TipoEventoResponse> {
        try {
            data.nombre_url = HString.convertToUrlString(data.nombre as String)
            const tipo = await TipoEvento.findByPk(id)
            if (!tipo) {
                return { result: false, error: 'Tipo de evento no encontrado' }
            }
            const updatedTipo = await tipo.update(data)
            return { result: true, data: updatedTipo }
        } catch (error) {
            // const msg = `Error al actualizar el tipo de evento: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async deleteTipo(id: number): Promise<TipoEventoResponse> {
        try {
            const tipo = await TipoEvento.findByPk(id);
            if (!tipo) {
                return { result: false, error: 'Tipo de evento no encontrado' };
            }
            await tipo.destroy();
            return { result: true, data: { id } };
        } catch (error) {
            // const msg = `Error al eliminar el tipo de evento: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg };
        }
    }
}

export default new TipoEventoService() 