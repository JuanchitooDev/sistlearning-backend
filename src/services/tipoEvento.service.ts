import TipoEvento from '../models/tipoEvento.models'
import { ITipoEvento, TipoEventoResponse } from '../interfaces/tipoEventoInterface'
import HString from '../helpers/HString';

class TipoEventoService {
    async getTipos(): Promise<TipoEventoResponse> {
        try {
            const tipos = await TipoEvento.findAll({
                attributes: [
                    'id',
                    'nombre',
                    'nombre_url',
                    'descripcion',
                    'estado'
                ],
                order: [
                    ['id', 'DESC']
                ]
            })
            return { result: true, data: tipos }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async getTiposPorEstado(estado: boolean): Promise<TipoEventoResponse> {
        try {
            const tipos = await TipoEvento.findAll({
                where: {
                    activo: estado
                },
                attributes: [
                    'id',
                    'nombre',
                    'nombre_url',
                    'descripcion',
                    'estado'
                ],
                order: [
                    ['id', 'DESC']
                ]
            })
            return { result: true, data: tipos }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async getTipoById(id: number): Promise<TipoEventoResponse> {
        try {
            const tipo = await TipoEvento.findByPk(id, {
                attributes: [
                    'id',
                    'nombre',
                    'nombre_url',
                    'descripcion',
                    'estado'
                ]
            })
            if (!tipo) {
                return { result: false, message: 'Tipo de evento no encontrado' }
            }
            return { result: true, data: tipo }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async createTipo(data: ITipoEvento): Promise<TipoEventoResponse> {
        try {
            data.nombre_url = HString.convertToUrlString(data.nombre as String)
            const newTipo = await TipoEvento.create(data as any)
            if (newTipo.id) {
                return { result: true, message: 'Tipo de evento registrado con éxito', data: newTipo }
            } else {
                return { result: false, message: 'Error al registrar el tipo de evento' }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async updateTipo(id: number, data: ITipoEvento): Promise<TipoEventoResponse> {
        try {
            if (data.nombre) {
                data.nombre_url = HString.convertToUrlString(data.nombre as String)
            }

            const tipo = await TipoEvento.findByPk(id)

            if (!tipo) {
                return { result: false, message: 'Tipo de evento no encontrado' }
            }

            const updatedTipo = await tipo.update(data)

            return { result: true, message: 'Tipo de evento actualizado con éxito', data: updatedTipo }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async deleteTipo(id: number): Promise<TipoEventoResponse> {
        try {
            const tipo = await TipoEvento.findByPk(id);
            if (!tipo) {
                return { result: false, message: 'Tipo de evento no encontrado' };
            }
            await tipo.destroy();
            return { result: true, data: { id }, message: 'Tipo de evento eliminado correctamente' };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage };
        }
    }
}

export default new TipoEventoService() 