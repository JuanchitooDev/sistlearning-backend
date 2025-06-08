import GrupoAdjunto from '@/models/grupoAdjunto.models'
import { IGrupoAdjunto, GrupoAdjuntoResponse } from "@/interfaces/grupoAdjuntoInterface"

class GrupoAdjuntoRepository {
    async getAll(): Promise<GrupoAdjuntoResponse> {
        try {
            const grupos = await GrupoAdjunto.findAll({
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

            return { result: true, data: grupos, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getAllByEstado(estado: boolean): Promise<GrupoAdjuntoResponse> {
        try {
            const grupos = await GrupoAdjunto.findAll({
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

            return { result: true, data: grupos, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getById(id: number): Promise<GrupoAdjuntoResponse> {
        try {
            const grupo = await GrupoAdjunto.findByPk(id, {
                attributes: [
                    'id',
                    'nombre',
                    'nombre_url',
                    'estado'
                ]
            })

            if (!grupo) {
                return { result: false, data: [], message: 'Grupo adjunto no encontrado', status: 200 }
            }

            return { result: true, data: grupo, message: 'Grupo adjunto encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async create(data: IGrupoAdjunto): Promise<GrupoAdjuntoResponse> {
        try {
            const newGrupo = await GrupoAdjunto.create(data as any)

            if (newGrupo.id) {
                return { result: true, message: 'Grupo adjunto registrado con éxito', data: newGrupo, status: 200 }
            }

            return { result: false, message: 'Error al registrar el grupo adjunto', data: [], status: 500 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async update(id: number, data: IGrupoAdjunto): Promise<GrupoAdjuntoResponse> {
        try {
            const grupo = await GrupoAdjunto.findByPk(id)

            if (!grupo) {
                return { result: false, message: 'Grupo adjunto no encontrado', data: [], status: 200 }
            }

            const updatedGrupo = await grupo.update(data)

            return { result: true, message: 'Grupo adjunto actualizado con éxito', data: updatedGrupo, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async updateEstado(id: number, estado: boolean): Promise<GrupoAdjuntoResponse> {
        try {
            const grupoAdjunto = await GrupoAdjunto.findByPk(id)

            if (!grupoAdjunto) {
                return { result: false, message: 'Grupo adjunto no encontrado', data: [], status: 200 }
            }

            grupoAdjunto.estado = estado
            await grupoAdjunto.save()

            return { result: true, message: 'Estado actualizado con éxito', data: grupoAdjunto, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async delete(id: number): Promise<GrupoAdjuntoResponse> {
        try {
            const grupo = await GrupoAdjunto.findByPk(id);

            if (!grupo) {
                return { result: false, data: [], message: 'Grupo adjunto no encontrado', status: 200 };
            }

            await grupo.destroy();

            return { result: true, data: { id }, message: 'Grupo adjunto eliminado correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new GrupoAdjuntoRepository()