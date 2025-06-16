import HString from "../helpers/HString";
import { ICargo, CargoResponse } from "../interfaces/cargoInterface";
import Cargo from "../models/cargo.models";

class CargoRepository {
    async getAll(): Promise<CargoResponse> {
        try {
            const cargos = await Cargo.findAll({
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

            return { result: true, data: cargos, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getAllByEstado(estado: boolean): Promise<CargoResponse> {
        try {
            const cargos = await Cargo.findAll({
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

            return { result: true, data: cargos, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getById(id: number): Promise<CargoResponse> {
        try {
            const cargo = await Cargo.findByPk(id, {
                attributes: [
                    'id',
                    'nombre',
                    'nombre_url',
                    'estado'
                ]
            })

            if (!cargo) {
                return { result: false, data: [], message: 'Cargo no encontrado', status: 200 }
            }

            return { result: true, data: cargo, message: 'Cargo encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getByNombre(nombre: string): Promise<CargoResponse> {
        try {
            const cargo = await Cargo.findOne({
                where: {
                    nombre
                },
                attributes: [
                    'id',
                    'nombre',
                    'nombre_url',
                    'estado'
                ],
                order: [
                    ['id', 'DESC']
                ]
            })

            if (!cargo) {
                return { result: false, data: [], message: 'Cargo no encontrado', status: 200 }
            }

            return { result: true, data: cargo, message: 'Cargo encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async create(data: ICargo): Promise<CargoResponse> {
        try {
            const { nombre } = data

            data.nombre_url = HString.convertToUrlString(nombre as string)

            const newCargo = await Cargo.create(data as any)

            if (newCargo.id) {
                return { result: true, message: 'Cargo registrado con éxito', data: newCargo, status: 200 }
            }

            return { result: false, message: 'Error al registrar el cargo', status: 500 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async update(id: number, data: ICargo): Promise<CargoResponse> {
        try {
            const { nombre } = data

            if (nombre) {
                data.nombre_url = HString.convertToUrlString(nombre as String)
            }

            const cargo = await Cargo.findByPk(id)

            if (!cargo) {
                return { result: false, message: 'Cargo no encontrado', status: 200 }
            }

            const updatedCargo = await cargo.update(data)

            return { result: true, message: 'Cargo actualizado con éxito', data: updatedCargo, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async updateEstado(id: number, estado: boolean): Promise<CargoResponse> {
        try {
            const cargo = await Cargo.findByPk(id)

            if (!cargo) {
                return { result: false, message: 'Cargo no encontrado', status: 200 }
            }

            cargo.estado = estado
            await cargo.save()

            return { result: true, message: 'Estado actualizado con éxito', data: cargo, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async delete(id: number): Promise<CargoResponse> {
        try {
            const cargo = await Cargo.findByPk(id);

            if (!cargo) {
                return { result: false, data: [], message: 'Cargo no encontrado', status: 200 };
            }

            await cargo.destroy();

            return { result: true, data: { id }, message: 'Cargo eliminado correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new CargoRepository()