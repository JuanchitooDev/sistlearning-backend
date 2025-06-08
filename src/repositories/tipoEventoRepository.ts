import TipoEvento from '@/models/tipoEvento.models'
import HString from "@/helpers/HString"
import { ITipoEvento, TipoEventoResponse } from "@/interfaces/tipoEventoInterface"

class TipoEventoRepository {
    async getAll(): Promise<TipoEventoResponse> {
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

            return { result: true, data: tipos, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getAllByEstado(estado: boolean): Promise<TipoEventoResponse> {
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

            return { result: true, data: tipos, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getById(id: number): Promise<TipoEventoResponse> {
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
                return { result: false, data: [], message: 'Tipo de evento no encontrado', status: 200 }
            }

            return { result: true, data: tipo, message: 'Tipo de evento encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getByNombre(nombre: string): Promise<TipoEventoResponse> {
        try {
            const tipo = await TipoEvento.findOne({
                where: {
                    nombre
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

            if (!tipo) {
                return { result: false, data: [], message: 'Tipo de evento no encontrado', status: 200 }
            }

            return { result: true, data: tipo, message: 'Tipo de evento encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async create(data: ITipoEvento): Promise<TipoEventoResponse> {
        try {
            data.nombre_url = HString.convertToUrlString(data.nombre as String)

            const newTipo = await TipoEvento.create(data as any)

            if (newTipo.id) {
                return { result: true, message: 'Tipo de evento registrado con éxito', data: newTipo, status: 200 }
            }

            return { result: false, message: 'Error al registrar el tipo de evento', data: [], status: 500 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async update(id: number, data: ITipoEvento): Promise<TipoEventoResponse> {
        try {
            if (data.nombre) {
                data.nombre_url = HString.convertToUrlString(data.nombre as String)
            }

            const tipo = await TipoEvento.findByPk(id)

            if (!tipo) {
                return { result: false, data: [], message: 'Tipo de evento no encontrado', status: 200 }
            }

            const updatedTipo = await tipo.update(data)

            return { result: true, data: updatedTipo, message: 'Tipo de evento actualizado con éxito', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async updateEstado(id: number, estado: boolean): Promise<TipoEventoResponse> {
        try {
            const tipo = await TipoEvento.findByPk(id)

            if (!tipo) {
                return { result: false, data: [], message: 'Tipo de evento no encontrado', status: 200 }
            }

            tipo.estado = estado
            await tipo.save()

            return { result: true, data: tipo, message: 'Estado actualizado con éxito', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async delete(id: number): Promise<TipoEventoResponse> {
        try {
            const tipo = await TipoEvento.findByPk(id);

            if (!tipo) {
                return { result: false, data: [], message: 'Tipo de evento no encontrado', status: 200 };
            }

            await tipo.destroy();

            return { result: true, data: { id }, message: 'Tipo de evento eliminado correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new TipoEventoRepository()