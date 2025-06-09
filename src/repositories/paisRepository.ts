import Pais from '../models/pais.models'
import { IPais, PaisResponse } from "../interfaces/paisInterface"
import HString from '../helpers/HString'

class PaisRepository {
    async getAll(): Promise<PaisResponse> {
        try {
            const paises = await Pais.findAll({
                attributes: [
                    'id',
                    'nombre',
                    'nombre_url',
                    'codigo_postal',
                    'estado'
                ],
                order: [
                    ['nombre', 'ASC']
                ]
            })

            return { result: true, data: paises, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getAllByEstado(estado: boolean): Promise<PaisResponse> {
        try {
            const paises = await Pais.findAll({
                where: {
                    activo: estado
                },
                attributes: [
                    'id',
                    'nombre',
                    'nombre_url',
                    'codigo_postal',
                    'estado'
                ],
                order: [
                    ['nombre', 'ASC']
                ]
            })

            return { result: true, data: paises, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getById(id: number): Promise<PaisResponse> {
        try {
            const pais = await Pais.findByPk(id, {
                attributes: [
                    'id',
                    'nombre',
                    'nombre_url',
                    'codigo_postal',
                    'estado'
                ]
            })

            if (!pais) {
                return { result: false, data: [], message: 'País no encontrado', status: 200 }
            }

            return { result: true, data: pais, message: 'País encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async create(data: IPais): Promise<PaisResponse> {
        try {
            data.nombre_url = HString.convertToUrlString(data.nombre as string)

            const newPais = await Pais.create(data as any)

            if (newPais.id) {
                return { result: true, message: 'País registrado con éxito', data: newPais, status: 200 }
            }

            return { result: false, message: 'Error al registrar el país', data: [], status: 500 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async update(id: number, data: IPais): Promise<PaisResponse> {
        try {
            data.nombre_url = HString.convertToUrlString(data.nombre as string)

            const pais = await Pais.findByPk(id)

            if (!pais) {
                return { result: false, message: 'País no encontrado', data: [], status: 200 }
            }

            const updatedPais = await pais.update(data)

            return { result: true, message: 'País actualizado con éxito', data: updatedPais, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async updateEstado(id: number, estado: boolean): Promise<PaisResponse> {
        try {
            const pais = await Pais.findByPk(id)

            if (!pais) {
                return { result: false, message: 'País no encontrado', data: [], status: 200 }
            }

            pais.estado = estado
            await pais.save()

            return { result: true, message: 'Estado actualizado con éxito', data: pais, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async delete(id: number): Promise<PaisResponse> {
        try {
            const pais = await Pais.findByPk(id);

            if (!pais) {
                return { result: false, data: [], message: 'País no encontrado', status: 200 };
            }

            await pais.destroy();

            return { result: true, data: { id }, message: 'País eliminado correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new PaisRepository()