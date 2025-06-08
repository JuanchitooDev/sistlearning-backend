import TipoAdjunto from '@/models/tipoAdjunto.models'
import { ITipoAdjunto, TipoAdjuntoResponse } from "@/interfaces/tipoAdjuntoInterface"

class TipoAdjuntoRepository {
    async getAll(): Promise<TipoAdjuntoResponse> {
        try {
            const tipos = await TipoAdjunto.findAll({
                attributes: [
                    'id',
                    'nombre',
                    'nombre_url',
                    'estado'
                ],
                order: [
                    ['nombre', 'ASC']
                ]
            })

            return { result: true, data: tipos, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getAllByEstado(estado: boolean): Promise<TipoAdjuntoResponse> {
        try {
            const tipos = await TipoAdjunto.findAll({
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
                    ['nombre', 'ASC']
                ]
            })

            return { result: true, data: tipos, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getById(id: number): Promise<TipoAdjuntoResponse> {
        try {
            const tipo = await TipoAdjunto.findByPk(id, {
                attributes: [
                    'id',
                    'nombre',
                    'nombre_url',
                    'estado'
                ]
            })

            if (!tipo) {
                return { result: false, data: [], message: 'Tipo de adjunto no encontrado', status: 200 }
            }

            return { result: true, data: tipo, message: 'Tipo de adjunto encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async create(data: ITipoAdjunto): Promise<TipoAdjuntoResponse> {
        try {
            const newTipo = await TipoAdjunto.create(data as any)

            if (newTipo.id) {
                return { result: true, message: 'Tipo de adjunto registrado con éxito', data: newTipo, status: 200 }
            }

            return { result: false, message: 'Error al registrar el tipo de adjunto', data: [], status: 500 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async update(id: number, data: ITipoAdjunto): Promise<TipoAdjuntoResponse> {
        try {
            const tipo = await TipoAdjunto.findByPk(id)

            if (!tipo) {
                return { result: false, message: 'Tipo de adjunto no encontrado', data: [], status: 200 }
            }

            const updatedTipo = await tipo.update(data)

            return { result: true, message: 'Tipo de adjunto actualizado con éxito', data: updatedTipo, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async updateEstado(id: number, estado: boolean): Promise<TipoAdjuntoResponse> {
        try {
            const tipoAdjunto = await TipoAdjunto.findByPk(id)

            if (!tipoAdjunto) {
                return { result: false, message: 'Tipo adjunto no encontrado', data: [], status: 200 }
            }

            tipoAdjunto.estado = estado
            await tipoAdjunto.save()

            return { result: true, message: 'Estado actualizado con éxito', data: tipoAdjunto, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async delete(id: number): Promise<TipoAdjuntoResponse> {
        try {
            const tipo = await TipoAdjunto.findByPk(id);

            if (!tipo) {
                return { result: false, data: [], message: 'Tipo de adjunto no encontrado', status: 200 };
            }

            await tipo.destroy();

            return { result: true, data: { id }, message: 'Tipo de adjunto eliminado correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new TipoAdjuntoRepository()