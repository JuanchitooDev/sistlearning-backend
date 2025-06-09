import { ITrabajador, TrabajadorResponse } from "../interfaces/trabajadorInterface";
import Trabajador from "../models/trabajador.models"
import Cargo from "../models/cargo.models"
import TipoDocumento from "../models/tipoDocumento.models"

class TrabajadorRepository {
    async getAll(): Promise<TrabajadorResponse> {
        try {
            const trabajadores = await Trabajador.findAll({
                attributes: [
                    'id',
                    'id_cargo',
                    'id_tipodocumento',
                    'numero_documento',
                    'apellido_paterno',
                    'apellido_materno',
                    'nombres',
                    'telefono',
                    'direccion',
                    'email',
                    'linkedin',
                    'fecha_nacimiento',
                    'biografia',
                    'sexo',
                    'firma',
                    'foto_perfil',
                    'estado'
                ],
                include: [
                    {
                        model: Cargo,
                        attributes: ['id', 'nombre']
                    },
                    {
                        model: TipoDocumento,
                        attributes: ['id', 'nombre']
                    }
                ],
                order: [
                    ['apellido_paterno', 'ASC']
                ]
            })

            return { result: true, data: trabajadores, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getAllByEstado(estado: boolean): Promise<TrabajadorResponse> {
        try {
            const trabajadores = await Trabajador.findAll({
                where: {
                    activo: estado
                },
                attributes: [
                    'id',
                    'id_cargo',
                    'id_tipodocumento',
                    'numero_documento',
                    'apellido_paterno',
                    'apellido_materno',
                    'nombres',
                    'telefono',
                    'direccion',
                    'email',
                    'linkedin',
                    'fecha_nacimiento',
                    'biografia',
                    'sexo',
                    'firma',
                    'foto_perfil',
                    'estado'
                ],
                include: [
                    {
                        model: Cargo,
                        attributes: ['id', 'nombre']
                    },
                    {
                        model: TipoDocumento,
                        attributes: ['id', 'nombre']
                    }
                ],
                order: [
                    ['apellido_paterno', 'ASC']
                ]
            })

            return { result: true, data: trabajadores, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getById(id: number): Promise<TrabajadorResponse> {
        try {
            const trabajador = await Trabajador.findByPk(id, {
                attributes: [
                    'id',
                    'id_cargo',
                    'id_tipodocumento',
                    'numero_documento',
                    'apellido_paterno',
                    'apellido_materno',
                    'nombres',
                    'telefono',
                    'direccion',
                    'email',
                    'linkedin',
                    'fecha_nacimiento',
                    'biografia',
                    'sexo',
                    'firma',
                    'foto_perfil',
                    'estado'
                ],
                include: [
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
                return { result: false, message: 'Trabajador no encontrado', data: [], status: 200 }
            }
            return { result: true, message: 'Trabajador encontrado', data: trabajador, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getByTipoDocNumDoc(idTipoDoc: number, numDoc: string): Promise<TrabajadorResponse> {
        try {
            const trabajador = await Trabajador.findOne({
                where: {
                    id_tipodocumento: idTipoDoc,
                    numero_documento: numDoc
                },
                attributes: [
                    'id',
                    'id_cargo',
                    'id_tipodocumento',
                    'numero_documento',
                    'apellido_paterno',
                    'apellido_materno',
                    'nombres',
                    'telefono',
                    'direccion',
                    'email',
                    'linkedin',
                    'fecha_nacimiento',
                    'biografia',
                    'sexo',
                    'firma',
                    'foto_perfil',
                    'estado'
                ],
                include: [
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
                return { result: false, data: [], message: 'Trabajador no encontrado', status: 200 }
            }

            return { result: true, data: trabajador, message: 'Trabajador encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getByNumDoc(numDoc: string): Promise<TrabajadorResponse> {
        try {
            const trabajador = await Trabajador.findOne({
                where: { numDoc },
                attributes: [
                    'id',
                    'id_cargo',
                    'id_tipodocumento',
                    'numero_documento',
                    'apellido_paterno',
                    'apellido_materno',
                    'nombres',
                    'telefono',
                    'direccion',
                    'email',
                    'linkedin',
                    'fecha_nacimiento',
                    'biografia',
                    'sexo',
                    'firma',
                    'foto_perfil',
                    'estado'
                ],
                include: [
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
                return { result: false, data: [], message: 'Trabajador no encontrado', status: 200 }
            }

            return { result: true, data: trabajador, message: 'Trabajador encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async create(data: ITrabajador): Promise<TrabajadorResponse> {
        try {
            const newTrabajador = await Trabajador.create(data as any)

            if (newTrabajador.id) {
                return { result: true, message: 'Trabajador registrado con éxito', data: newTrabajador, status: 200 }
            }

            return { result: true, message: 'Error al registrar el trabajador', data: [], status: 500 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async update(id: number, data: ITrabajador): Promise<TrabajadorResponse> {
        try {
            const trabajador = await Trabajador.findByPk(id)
            if (!trabajador) {
                return { result: false, message: 'Trabajador no encontrado', status: 404 }
            }
            const updatedTrabajador = await trabajador.update(data)
            return { result: true, message: 'Trabajador actualizado con éxito', data: updatedTrabajador, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async updateEstado(id: number, estado: boolean): Promise<TrabajadorResponse> {
        try {
            const trabajador = await Trabajador.findByPk(id)

            if (!trabajador) {
                return { result: false, data: [], message: 'Trabajador no encontrado', status: 200 }
            }

            trabajador.estado = estado
            await trabajador.save()

            return { result: true, message: 'Estado actualizado con éxito', data: trabajador, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async delete(id: number): Promise<TrabajadorResponse> {
        try {
            const trabajador = await Trabajador.findByPk(id);

            if (!trabajador) {
                return { result: false, message: 'Trabajador no encontrado', status: 404 };
            }

            await trabajador.destroy();

            return { result: true, data: { id }, message: 'Trabajador eliminado correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new TrabajadorRepository()