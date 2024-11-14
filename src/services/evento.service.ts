import Evento from '../models/evento.models'
import { IEvento, EventoResponse } from '../interfaces/eventoInterface'
import HString from '../helpers/HString';
import TipoEvento from '../models/tipoEvento.models';

class EventoService {
    async getEventos(): Promise<EventoResponse> {
        try {
            const eventos = await Evento.findAll({
                attributes: [
                    'id', 'id_parent', 'id_tipoevento', 'titulo', 'titulo_url', 'descripcion', 'temario', 'plantilla_certificado', 'fecha', 'modalidad', 'precio', 'estado'
                ],
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
            const evento = await Evento.findByPk(id, {
                attributes: [
                    'id', 'id_parent', 'id_tipoevento', 'titulo', 'titulo_url', 'descripcion', 'temario', 'plantilla_certificado', 'fecha', 'modalidad', 'precio', 'estado'
                ],
                include: [{
                    model: TipoEvento,
                    attributes: ['id', 'nombre']
                }]
            })
            if (!evento) {
                return { result: false, message: 'Evento no encontrado' }
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

            if (newEvento.id) {
                return { result: true, message: 'Evento registrado con éxito', data: newEvento }
            } else {
                return { result: false, message: 'Error al registrar el evento' }
            }
            
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
                return { result: false, message: 'Evento no encontrado' }
            }
            const updatedEvento = await evento.update(data)
            return { result: true, message: 'Evento actualizado con éxito', data: updatedEvento }
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
                return { result: false, message: 'Evento no encontrado' };
            }
            await evento.destroy();
            return { result: true, data: { id }, message: 'Evento eliminado correctamente' };
        } catch (error) {
            // const msg = `Error al eliminar el evento: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg };
        }
    }
}

export default new EventoService() 