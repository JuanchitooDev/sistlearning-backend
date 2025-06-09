import { IPerfil, PerfilResponse } from "../interfaces/perfilInterface"
import Perfil from "../models/perfil.models"
import HString from "../helpers/HString"

class PerfilRepository {
    async getAll(): Promise<PerfilResponse> {
        try {
            const perfiles = await Perfil.findAll({
                attributes: [
                    'id',
                    'nombre',
                    'nombre_url',
                    'sistema',
                    'estado'
                ],
                order: [
                    ['id', 'DESC']
                ]
            })

            return { result: true, data: perfiles, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getAllByEstado(estado: boolean): Promise<PerfilResponse> {
        try {
            const perfiles = await Perfil.findAll({
                where: {
                    activo: estado
                },
                attributes: [
                    'id',
                    'nombre',
                    'nombre_url',
                    'sistema',
                    'estado'
                ],
                order: [
                    ['id', 'DESC']
                ]
            })

            return { result: true, data: perfiles, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getById(id: number): Promise<PerfilResponse> {
        try {
            const perfil = await Perfil.findByPk(id, {
                attributes: [
                    'id',
                    'nombre',
                    'nombre_url',
                    'sistema',
                    'estado'
                ]
            })

            if (!perfil) {
                return { result: false, data: [], message: 'Perfil no encontrado', status: 200 }
            }

            return { result: true, data: perfil, message: 'Perfil encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async create(data: IPerfil): Promise<PerfilResponse> {
        try {
            data.nombre_url = HString.convertToUrlString(data.nombre as String)

            const newPerfil = await Perfil.create(data as any)

            if (newPerfil.id) {
                return { result: true, message: 'Perfil registrado con éxito', data: newPerfil, status: 200 }
            }

            return { result: false, message: 'Error al registrar el perfil', data: [], status: 500 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async update(id: number, data: IPerfil): Promise<PerfilResponse> {
        try {
            if (data.nombre) {
                data.nombre_url = HString.convertToUrlString(data.nombre as String)
            }

            const perfil = await Perfil.findByPk(id)

            if (!perfil) {
                return { result: false, data: [], message: 'Perfil no encontrado', status: 200 }
            }

            const updatedPerfil = await perfil.update(data)

            return { result: true, message: 'Perfil actualizado con éxito', data: updatedPerfil, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async updateEstado(id: number, estado: boolean): Promise<PerfilResponse> {
        try {
            const perfil = await Perfil.findByPk(id)

            if (!perfil) {
                return { result: false, data: [], message: 'Perfil no encontrado', status: 200 }
            }

            perfil.estado = estado
            await perfil.save()

            return { result: true, data: perfil, message: 'Estado actualizado con éxito', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async delete(id: number): Promise<PerfilResponse> {
        try {
            const perfil = await Perfil.findByPk(id)

            if (!perfil) {
                return { result: false, message: 'Perfil no encontrado', status: 404 }
            }

            await perfil.destroy()

            return { result: true, data: { id }, message: 'Perfil eliminado correctamente', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }
}

export default new PerfilRepository()