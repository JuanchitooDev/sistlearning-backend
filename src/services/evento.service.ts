import Evento from '../models/evento.models'
import { IEvento, EventoResponse } from '../interfaces/eventoInterface'
import HString from '../helpers/HString';
import TipoEvento from '../models/tipoEvento.models';

class EventoService {
    async getEventos(): Promise<EventoResponse> {
        try {
            // const eventos = await Evento.findAll()
            const eventos = await Evento.findAll({
                include: [{
                    model: TipoEvento,
                    attributes: ['id', 'nombre']
                }]
            })
            return { result: true, data: eventos }
        } catch (error) {
            // const msg = `Error al obtener los eventos: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async getEventoById(id: number): Promise<EventoResponse> {
        try {
            const evento = await Evento.findByPk(id)
            if (!evento) {
                return { result: false, error: 'Evento no encontrado' }
            }
            return { result: true, data: evento }
        } catch (error) {
            // const msg = `Error al obtener el evento: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async createEvento(data: IEvento): Promise<EventoResponse> {
        try {
            data.titulo_url = HString.convertToUrlString(data.titulo as String)
            const newEvento = await Evento.create(data as any)
            return { result: true, data: newEvento }
        } catch (error) {
            // const msg = `Error al crear el evento: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async updateEvento(id: number, data: IEvento): Promise<EventoResponse> {
        try {
            data.titulo_url = HString.convertToUrlString(data.titulo as String)
            const evento = await Evento.findByPk(id)
            if (!evento) {
                return { result: false, error: 'Evento no encontrado' }
            }
            const updatedEvento = await evento.update(data)
            return { result: true, data: updatedEvento }
        } catch (error) {
            // const msg = `Error al actualizar el evento: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async deleteEvento(id: number): Promise<EventoResponse> {
        try {
            const evento = await Evento.findByPk(id);
            if (!evento) {
                return { result: false, error: 'Evento no encontrado' };
            }
            await evento.destroy();
            return { result: true, data: { id } };
        } catch (error) {
            // const msg = `Error al eliminar el evento: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg };
        }
    }
}

export default new EventoService() 