import Trabajador from '../models/trabajador.models'
import { ITrabajador, TrabajadorResponse } from '../interfaces/trabajadorInterface'
import Perfil from '../models/perfil.models';
import Cargo from '../models/cargo.models';
import TipoDocumento from '../models/tipoDocumento.models';

class TrabajadorService {
    async getTrabajadores(): Promise<TrabajadorResponse> {
        try {
            const trabajadores = await Trabajador.findAll({
                include: [
                    {
                        model: Perfil,
                        attributes: ['id', 'nombre']
                    },
                    {
                        model: Cargo,
                        attributes: ['id', 'nombre']
                    },
                    {
                        model: TipoDocumento,
                        attributes: ['id', 'nombre']
                    }
                ]
            })
            return { result: true, data: trabajadores }
        } catch (error) {
            // const msg = `Error al obtener el personal: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async getTrabajadorById(id: number): Promise<TrabajadorResponse> {
        try {
            const trabajador = await Trabajador.findByPk(id, {
                include: [
                    {
                        model: Perfil,
                        attributes: ['id', 'nombre']
                    },
                    {
                        model: Cargo,
                        attributes: ['id', 'nombre']
                    },
                    {
                        model: TipoDocumento,
                        attributes: ['id', 'nombre']
                    }
                ]
            })
            if (!trabajador) {
                return { result: false, error: 'Trabajador no encontrado' }
            }
            return { result: true, data: trabajador }
        } catch (error) {
            // const msg = `Error al obtener el personal: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async createTrabajador(data: ITrabajador): Promise<TrabajadorResponse> {
        try {
            const newTrabajador = await Trabajador.create(data as any)
            return { result: true, data: newTrabajador }
        } catch (error) {
            // const msg = `Error al crear el personal: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async updateTrabajador(id: number, data: ITrabajador): Promise<TrabajadorResponse> {
        try {
            const trabajador = await Trabajador.findByPk(id)
            if (!trabajador) {
                return { result: false, error: 'Trabajador no encontrado' }
            }
            const updatedTrabajador = await trabajador.update(data)
            return { result: true, data: updatedTrabajador }
        } catch (error) {
            // const msg = `Error al actualizar el personal: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async deleteTrabajador(id: number): Promise<TrabajadorResponse> {
        try {
            const trabajador = await Trabajador.findByPk(id);
            if (!trabajador) {
                return { result: false, error: 'Trabajador no encontrado' };
            }
            await trabajador.destroy();
            return { result: true, data: { id } };
        } catch (error) {
            // const msg = `Error al eliminar el personal: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg };
        }
    }
}

export default new TrabajadorService() 