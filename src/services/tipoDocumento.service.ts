import TipoDocumento from '../models/tipoDocumento.models'
import { ITipoDocumento, TipoDocumentoResponse } from '../interfaces/tipoDocumentoInterface'
import HString from '../helpers/HString';

class TipoDocumentoService {
    async getTipos(): Promise<TipoDocumentoResponse> {
        try {
            const tipos = await TipoDocumento.findAll({
                attributes: [
                    'id',
                    'nombre',
                    'nombre_url',
                    'abreviatura',
                    'longitud',
                    'en_persona',
                    'en_empresa',
                    'compra',
                    'venta',
                    'sistema',
                    'estado'
                ],
                order: [
                    ['nombre', 'ASC']
                ]
            })
            return { result: true, data: tipos }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async getTiposPorCategoria(categoria: string): Promise<TipoDocumentoResponse> {
        try {
            let tipos = null
            if (categoria == 'persona') {
                tipos = await TipoDocumento.findAll({
                    where: {
                        "en_persona": true,
                        "en_empresa": false,
                        "estado": true
                    },
                    attributes: [
                        'id',
                        'nombre',
                        'nombre_url',
                        'abreviatura',
                        'longitud',
                        'en_persona',
                        'en_empresa',
                        'compra',
                        'venta',
                        'sistema',
                        'estado'
                    ],
                    order: [
                        ['nombre', 'ASC']
                    ]
                })
            } else {
                tipos = await TipoDocumento.findAll({
                    where: {
                        "en_empresa": true,
                        "en_persona": false,
                        "estado": true
                    },
                    attributes: [
                        'id',
                        'nombre',
                        'nombre_url',
                        'abreviatura',
                        'longitud',
                        'en_persona',
                        'en_empresa',
                        'compra',
                        'venta',
                        'sistema',
                        'estado'
                    ],
                    order: [
                        ['nombre', 'ASC']
                    ]
                })
            }

            return { result: true, data: tipos }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async getTipoById(id: number): Promise<TipoDocumentoResponse> {
        try {
            const tipo = await TipoDocumento.findByPk(id, {
                attributes: [
                    'id',
                    'nombre',
                    'nombre_url',
                    'abreviatura',
                    'longitud',
                    'en_persona',
                    'en_empresa',
                    'compra',
                    'venta',
                    'sistema',
                    'estado'
                ]
            })
            if (!tipo) {
                return { result: false, message: 'Tipo de documento no encontrado' }
            }
            return { result: true, data: tipo }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async createTipo(data: ITipoDocumento): Promise<TipoDocumentoResponse> {
        try {
            data.nombre_url = HString.convertToUrlString(data.nombre as String)
            const newTipo = await TipoDocumento.create(data as any)
            if (newTipo.id) {
                return { result: true, message: 'Tipo de documento registrado con éxito', data: newTipo }
            } else {
                return { result: false, message: 'Error al registrar el tipo de documento' }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async updateTipo(id: number, data: ITipoDocumento): Promise<TipoDocumentoResponse> {
        try {
            if (data.nombre) {
                data.nombre_url = HString.convertToUrlString(data.nombre as String)
            }

            const tipo = await TipoDocumento.findByPk(id)
            if (!tipo) {
                return { result: false, message: 'Tipo de documento no encontrado' }
            }

            const updatedTipo = await tipo.update(data)
            return { result: true, message: 'Tipo de documento actualizado con éxito', data: updatedTipo }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async deleteTipo(id: number): Promise<TipoDocumentoResponse> {
        try {
            const tipo = await TipoDocumento.findByPk(id);
            if (!tipo) {
                return { result: false, message: 'Tipo de documento no encontrado' };
            }
            await tipo.destroy();
            return { result: true, data: { id }, message: 'Tipo de documento eliminado correctamente' };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage };
        }
    }
}

export default new TipoDocumentoService() 