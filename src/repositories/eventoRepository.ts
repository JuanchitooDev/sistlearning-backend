import Evento from "@/models/evento.models"
import TipoEvento from "@/models/tipoEvento.models"
import CategoriaEvento from "@/models/categoriaEvento.models"
import HString from "@/helpers/HString"
import { IEvento, EventoResponse } from "@/interfaces/eventoInterface"
import Instructor from "@/models/instructor.models"

class EventoRepository {
    async getAll(): Promise<EventoResponse> {
        try {
            const eventos = await Evento.findAll({
                attributes: [
                    'id',
                    'id_parent',
                    'id_tipoevento',
                    'id_categoriaevento',
                    'id_instructor',
                    'titulo',
                    'titulo_url',
                    'descripcion',
                    'temario',
                    'plantilla_certificado',
                    'fecha',
                    'fecha_fin',
                    'modalidad',
                    'duracion',
                    'capacidad_maxima',
                    'precio',
                    'estado'
                ],
                include: [
                    {
                        model: TipoEvento,
                        attributes: ['id', 'nombre']
                    },
                    {
                        model: CategoriaEvento,
                        attributes: ['id', 'nombre']
                    },
                    {
                        model: Instructor,
                        attributes: ['id', 'apellido_paterno', 'apellido_materno', 'nombres', 'nombre_capitalized']
                    }
                ],
                order: [
                    ['id', 'DESC']
                ]
            })

            return { result: true, data: eventos, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getAllByEstado(estado: boolean): Promise<EventoResponse> {
        try {
            const eventos = await Evento.findAll({
                where: {
                    activo: estado
                },
                attributes: [
                    'id',
                    'id_parent',
                    'id_tipoevento',
                    'id_categoriaevento',
                    'id_instructor',
                    'titulo',
                    'titulo_url',
                    'descripcion',
                    'temario',
                    'plantilla_certificado',
                    'fecha',
                    'fecha_fin',
                    'modalidad',
                    'duracion',
                    'capacidad_maxima',
                    'precio',
                    'estado'
                ],
                include: [
                    {
                        model: TipoEvento,
                        attributes: ['id', 'nombre']
                    },
                    {
                        model: CategoriaEvento,
                        attributes: ['id', 'nombre']
                    },
                    {
                        model: Instructor,
                        attributes: ['id', 'apellido_paterno', 'apellido_materno', 'nombres', 'nombre_capitalized']
                    }
                ],
                order: [
                    ['id', 'DESC']
                ]
            })

            return { result: true, data: eventos, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getById(id: number): Promise<EventoResponse> {
        try {
            const evento = await Evento.findByPk(id, {
                attributes: [
                    'id',
                    'id_parent',
                    'id_tipoevento',
                    'id_categoriaevento',
                    'id_instructor',
                    'titulo',
                    'titulo_url',
                    'descripcion',
                    'temario',
                    'plantilla_certificado',
                    'fecha',
                    'fecha_fin',
                    'modalidad',
                    'duracion',
                    'capacidad_maxima',
                    'precio',
                    'estado'
                ],
                include: [
                    {
                        model: TipoEvento,
                        attributes: ['id', 'nombre']
                    },
                    {
                        model: CategoriaEvento,
                        attributes: ['id', 'nombre']
                    },
                    {
                        model: Instructor,
                        attributes: ['id', 'apellido_paterno', 'apellido_materno', 'nombres', 'nombre_capitalized']
                    }
                ]
            })

            if (!evento) {
                return { result: false, data: [], message: 'Evento no encontrado', status: 200 }
            }

            return { result: true, data: evento, message: 'Evento encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getByTitulo(titulo: string): Promise<EventoResponse> {
        try {
            const evento = await Evento.findOne({
                where: {
                    titulo
                },
                attributes: [
                    'id',
                    'id_parent',
                    'id_tipoevento',
                    'id_categoriaevento',
                    'id_instructor',
                    'titulo',
                    'titulo_url',
                    'descripcion',
                    'temario',
                    'plantilla_certificado',
                    'fecha',
                    'fecha_fin',
                    'modalidad',
                    'duracion',
                    'capacidad_maxima',
                    'precio',
                    'estado'
                ],
                include: [
                    {
                        model: TipoEvento,
                        attributes: ['id', 'nombre']
                    },
                    {
                        model: CategoriaEvento,
                        attributes: ['id', 'nombre']
                    },
                    {
                        model: Instructor,
                        attributes: ['id', 'apellido_paterno', 'apellido_materno', 'nombres', 'nombre_capitalized']
                    }
                ]
            })

            if (!evento) {
                return { result: false, data: [], message: 'Evento no encontrado', status: 200 }
            }

            return { result: true, data: evento, message: 'Evento encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async create(data: IEvento): Promise<EventoResponse> {
        try {
            const plantillaCertificado = `plantillas/${data.plantilla_certificado}.pdf`

            data.plantilla_certificado = plantillaCertificado
            data.titulo_url = HString.convertToUrlString(data.titulo as String)

            const newEvento = await Evento.create(data as any)

            if (newEvento.id) {
                return { result: true, message: 'Evento registrado con éxito', data: newEvento, status: 200 }
            }

            return { result: false, message: 'Error al registrar el evento', data: [], status: 500 }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async update(id: number, data: IEvento): Promise<EventoResponse> {
        try {
            if (data.titulo) {
                const plantillaCertificado = `plantillas/${data.plantilla_certificado}.pdf`

                data.plantilla_certificado = plantillaCertificado
                data.titulo_url = HString.convertToUrlString(data.titulo as String)
            }

            const evento = await Evento.findByPk(id)

            if (!evento) {
                return { result: false, data: [], message: 'Evento no encontrado', status: 200 }
            }

            const updatedEvento = await evento.update(data)

            return { result: true, data: updatedEvento, message: 'Evento actualizado con éxito', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async updateEstado(id: number, estado: boolean): Promise<EventoResponse> {
        try {
            const evento = await Evento.findByPk(id)

            if (!evento) {
                return { result: false, data: [], message: 'Evento no encontrado', status: 200 }
            }

            evento.estado = estado
            evento.save()

            return { result: true, data: evento, message: 'Estado actualizado con éxito', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async delete(id: number): Promise<EventoResponse> {
        try {
            const evento = await Evento.findByPk(id);

            if (!evento) {
                return { result: false, data: [], message: 'Evento no encontrado', status: 200 };
            }

            await evento.destroy();

            return { result: true, data: { id }, message: 'Evento eliminado correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new EventoRepository()