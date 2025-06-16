import HString from "../helpers/HString";
import { IAdjunto, AdjuntoResponse } from "../interfaces/adjuntoInterface";
import Adjunto from "../models/adjunto.models"
import Evento from "../models/evento.models";
import TipoAdjunto from "../models/tipoAdjunto.models";
import GrupoAdjunto from "../models/grupoAdjunto.models";
import fs from 'fs';

class AdjuntoRepository {
    async getAll(): Promise<AdjuntoResponse> {
        try {
            const adjuntos = await Adjunto.findAll({
                attributes: [
                    'id',
                    'id_tipoadjunto',
                    'id_grupoadjunto',
                    'id_evento',
                    'titulo',
                    'titulo_url',
                    'descripcion',
                    'filename',
                    'originalname',
                    'filepath',
                    'mimetype',
                    'size',
                    'es_descargable',
                    'es_visible',
                    'estado'
                ],
                include: [
                    {
                        model: TipoAdjunto,
                        attributes: [
                            'id',
                            'nombre',
                            'nombre_url'
                        ]
                    },
                    {
                        model: GrupoAdjunto,
                        attributes: [
                            'id',
                            'nombre',
                            'nombre_url'
                        ]
                    },
                    {
                        model: Evento,
                        attributes: [
                            'id',
                            'titulo',
                            'titulo_url'
                        ]
                    }
                ],
                order: [
                    ['id', 'DESC']
                ]
            })

            return { result: true, data: adjuntos, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getAllByEstado(estado: boolean): Promise<AdjuntoResponse> {
        try {
            const adjuntos = await Adjunto.findAll({
                where: {
                    activo: estado
                },
                attributes: [
                    'id',
                    'id_tipoadjunto',
                    'id_grupoadjunto',
                    'id_evento',
                    'titulo',
                    'titulo_url',
                    'descripcion',
                    'filename',
                    'originalname',
                    'filepath',
                    'mimetype',
                    'size',
                    'es_descargable',
                    'es_visible',
                    'estado'
                ],
                include: [
                    {
                        model: TipoAdjunto,
                        attributes: [
                            'id',
                            'nombre',
                            'nombre_url'
                        ]
                    },
                    {
                        model: GrupoAdjunto,
                        attributes: [
                            'id',
                            'nombre',
                            'nombre_url'
                        ]
                    },
                    {
                        model: Evento,
                        attributes: [
                            'id',
                            'titulo',
                            'titulo_url'
                        ]
                    }
                ],
                order: [
                    ['id', 'DESC']
                ]
            })
            return { result: true, data: adjuntos, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getById(id: number): Promise<AdjuntoResponse> {
        try {
            const adjunto = await Adjunto.findByPk(id, {
                attributes: [
                    'id',
                    'id_tipoadjunto',
                    'id_grupoadjunto',
                    'id_evento',
                    'titulo',
                    'titulo_url',
                    'descripcion',
                    'filename',
                    'originalname',
                    'filepath',
                    'mimetype',
                    'size',
                    'es_descargable',
                    'es_visible',
                    'estado'
                ],
                include: [
                    {
                        model: TipoAdjunto,
                        attributes: [
                            'id',
                            'nombre',
                            'nombre_url'
                        ]
                    },
                    {
                        model: GrupoAdjunto,
                        attributes: [
                            'id',
                            'nombre',
                            'nombre_url'
                        ]
                    },
                    {
                        model: Evento,
                        attributes: [
                            'id',
                            'titulo',
                            'titulo_url'
                        ]
                    }
                ]
            })

            if (!adjunto) {
                return { result: false, data: [], message: 'Adjunto no encontrado', status: 200 }
            }

            return { result: true, data: adjunto, message: 'Adjunto encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getAllByTipoAdjuntoEvento(idTipoAdjunto: number, idEvento: number): Promise<AdjuntoResponse> {
        try {
            let whereClause: any = {}

            if (idTipoAdjunto) {
                whereClause.id_tipoadjunto = idTipoAdjunto
            }

            if (idEvento) {
                whereClause.id_evento = idEvento
            }

            const adjuntos = await Adjunto.findAll({
                where: whereClause,
                attributes: [
                    'id',
                    'id_tipoadjunto',
                    'id_grupoadjunto',
                    'id_evento',
                    'titulo',
                    'titulo_url',
                    'descripcion',
                    'filename',
                    'originalname',
                    'filepath',
                    'mimetype',
                    'size',
                    'es_descargable',
                    'es_visible',
                    'estado'
                ],
                include: [
                    {
                        model: TipoAdjunto,
                        attributes: ['id', 'nombre', 'nombre_url']
                    },
                    {
                        model: GrupoAdjunto,
                        attributes: ['id', 'nombre', 'nombre_url']
                    },
                    {
                        model: Evento,
                        attributes: ['id', 'titulo', 'titulo_url']
                    }
                ],
                order: [
                    ['id', 'DESC']
                ]
            })

            return { result: true, data: adjuntos, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async downloadById(id: number) {
        try {
            const response = await this.getById(id)

            const { result, data, message, error } = response

            if (result) {
                const adjunto = data as IAdjunto

                const { filepath, filename } = adjunto

                const path = filepath as string

                const fileName = filename as string

                // Verificar si el archivo existe antes de descargarlo
                if (fs.existsSync(path)) {
                    const result = {
                        result: true,
                        message,
                        outputPath: path,
                        fileName,
                        status: 200
                    }
                    return result
                }

                return { result: false, message: 'Adjunto no encontrado', outputPath: null, fileName: null, status: 200 }
            } else {
                return { result: false, error, outputPath: null, fileName: null, status: 500 }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async create(data: IAdjunto): Promise<AdjuntoResponse> {
        try {
            const { titulo } = data

            data.titulo_url = HString.convertToUrlString(titulo as String)

            const newAdjunto = await Adjunto.create(data as any)

            const { id } = newAdjunto

            if (id) {
                return { result: true, message: 'Adjunto registrado con éxito', data: newAdjunto, status: 200 }
            }

            return { result: false, message: 'Error al registrar el adjunto', data: [], status: 500 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async update(id: number, data: IAdjunto): Promise<AdjuntoResponse> {
        try {
            const { titulo } = data

            if (titulo) {
                data.titulo_url = HString.convertToUrlString(titulo as String)
            }

            const adjunto = await Adjunto.findByPk(id)

            if (!adjunto) {
                return { result: false, message: 'Adjunto no encontrado', data: [], status: 200 }
            }

            const updatedAdjunto = await adjunto.update(data)

            return { result: true, message: 'Adjunto actualizado con éxito', data: updatedAdjunto, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async updateEstado(id: number, estado: boolean): Promise<AdjuntoResponse> {
        try {
            const adjunto = await Adjunto.findByPk(id)

            if (!adjunto) {
                return { result: false, message: 'Adjunto no encontrado', data: [], status: 200 }
            }

            adjunto.estado = estado

            await adjunto.save()

            return { result: true, message: 'Estado actualizado con éxito', data: adjunto, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async delete(id: number): Promise<AdjuntoResponse> {
        try {
            const adjunto = await Adjunto.findByPk(id);

            if (!adjunto) {
                return { result: false, data: [], message: 'Adjunto no encontrado', status: 200 };
            }

            await adjunto.destroy();

            return { result: true, data: { id }, message: 'Adjunto eliminado correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new AdjuntoRepository()