import Cargo from '../models/cargo.models'
import { ICargo, CargoResponse } from '../interfaces/cargoInterface'
import HString from '../helpers/HString';

class CargoService {
    async getCargos(): Promise<CargoResponse> {
        try {
            const cargos = await Cargo.findAll({
                attributes: [
                    'id', 'nombre', 'nombre_url', 'estado'
                ]
            })
            return { result: true, data: cargos }
        } catch (error) {
            // const msg = `Error al obtener los eventos: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async getCargoById(id: number): Promise<CargoResponse> {
        try {
            const cargo = await Cargo.findByPk(id, {
                attributes: [
                    'id', 'nombre', 'nombre_url', 'estado'
                ]
            })
            if (!cargo) {
                return { result: false, message: 'Cargo no encontrado' }
            }
            return { result: true, data: cargo }
        } catch (error) {
            // const msg = `Error al obtener el evento: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async createCargo(data: ICargo): Promise<CargoResponse> {
        try {
            data.nombre_url = HString.convertToUrlString(data.nombre as String)
            const newCargo = await Cargo.create(data as any)
            if (newCargo.id) {
                return { result: true, message: 'Cargo registrado con éxito', data: newCargo }
            } else {
                return { result: false, message: 'Error al registrar el cargo' }
            }
            
        } catch (error) {
            // const msg = `Error al crear el evento: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async updateCargo(id: number, data: ICargo): Promise<CargoResponse> {
        try {
            data.nombre_url = HString.convertToUrlString(data.nombre as String)
            const cargo = await Cargo.findByPk(id)
            if (!cargo) {
                return { result: false, message: 'Cargo no encontrado' }
            }
            const updatedCargo = await cargo.update(data)
            return { result: true, message: 'Cargo actualizado con éxito', data: updatedCargo }
        } catch (error) {
            // const msg = `Error al actualizar el evento: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async deleteCargo(id: number): Promise<CargoResponse> {
        try {
            const cargo = await Cargo.findByPk(id);
            if (!cargo) {
                return { result: false, message: 'Cargo no encontrado' };
            }
            await cargo.destroy();
            return { result: true, data: { id }, message: 'Cargo eliminado correctamente' };
        } catch (error) {
            // const msg = `Error al eliminar el evento: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg };
        }
    }
}

export default new CargoService() 