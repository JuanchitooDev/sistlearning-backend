import Contenido from '../models/contenido.models'
import { IContenido, ContenidoResponse } from '../interfaces/contenidoInterface'
import HString from '../helpers/HString';
import TipoContenido from '../models/tipoContenido.models';
import Evento from '../models/evento.models';

class ContenidoService {
    async getContenidos(): Promise<ContenidoResponse> {
        try {
            const contenidos = await Contenido.findAll({
                attributes: [
                    'id',
                    'id_tipocontenido',
                    'id_evento',
                    'titulo',
                    'titulo_url',
                    'descripcion',
                    'url',
                    'es_descargable',
                    'es_visible',
                    'estado'
                ],
                include: [
                    {
                        model: TipoContenido,
                        attributes: ['id', 'nombre']
                    },
                    {
                        model: Evento,
                        attributes: ['id', 'titulo']
                    }
                ],
                order: [
                    ['titulo', 'ASC']
                ]
            })
            return { result: true, data: contenidos }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async getContenidoById(id: number): Promise<ContenidoResponse> {
        try {
            const contenido = await Contenido.findByPk(id, {
                attributes: [
                    'id', 'id_tipocontenido', 'id_evento', 'titulo', 'titulo_url', 'descripcion', 'url', 'es_descargable', 'estado'
                ],
                include: [
                    {
                        model: TipoContenido,
                        attributes: ['id', 'nombre']
                    },
                    {
                        model: Evento,
                        attributes: ['id', 'titulo']
                    }
                ]
            })
            if (!contenido) {
                return { result: false, message: 'Evento no encontrado' }
            }
            return { result: true, data: contenido }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async createContenido(data: IContenido): Promise<ContenidoResponse> {
        try {
            data.titulo_url = HString.convertToUrlString(data.titulo as String)
            const newContenido = await Contenido.create(data as any)

            if (newContenido.id) {
                return { result: true, message: 'Contenido registrado con éxito', data: newContenido }
            } else {
                return { result: false, message: 'Error al registrar el contenido' }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async updateContenido(id: number, data: IContenido): Promise<ContenidoResponse> {
        try {
            if (data.titulo) {
                data.titulo_url = HString.convertToUrlString(data.titulo as String)
            }

            const contenido = await Contenido.findByPk(id)

            if (!contenido) {
                return { result: false, message: 'Contenido no encontrado' }
            }

            const updatedContenido = await contenido.update(data)
            return { result: true, message: 'Certificado actualizado con éxito', data: updatedContenido }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async deleteContenido(id: number): Promise<ContenidoResponse> {
        try {
            const contenido = await Contenido.findByPk(id);
            if (!contenido) {
                return { result: false, message: 'Contenido no encontrado' };
            }
            await contenido.destroy();
            return { result: true, data: { id }, message: 'Contenido eliminado correctamente' };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage };
        }
    }
}

export default new ContenidoService() 