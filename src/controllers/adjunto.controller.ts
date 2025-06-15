import { Request, Response } from 'express'
import AdjuntoService from '../services/adjunto.service'

class AdjuntoController {
    async getAdjuntos(req: Request, res: Response) {
        const response = await AdjuntoService.getAdjuntos()

        const { result } = response

        if (result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
        }
    }

    async getAdjuntosPorEstado(req: Request, res: Response) {
        const { params } = req

        const { estado } = params

        const estadoParam: boolean = estado === 'true'

        const response = await AdjuntoService.getAdjuntosPorEstado(estadoParam)

        const { result, error } = response

        if (result) {
            res.status(200).json(response)
        } else {
            if (error) {
                res.status(500).json(response)
            } else {
                res.status(200).json(response)
            }
        }
    }

    async getAdjuntoPorId(req: Request, res: Response) {
        const { params } = req

        const { id } = params

        const response = await AdjuntoService.getAdjuntoPorId(+id)

        const { result, error } = response

        if (result) {
            res.status(200).json(response)
        } else {
            if (error) {
                res.status(500).json(response)
            } else {
                res.status(200).json(response);
            }
        }
    }

    async downloadAdjunto(req: Request, res: Response) {
        const { id } = req.params

        const response = await AdjuntoService.downloadPorId(+id)

        const { result, outputPath, fileName, message } = response

        if (result) {
            const outputPathParam = outputPath as string

            const fileNameParam = fileName as string

            res.download(outputPathParam, fileNameParam, (err) => {
                if (err) {
                    console.error(err)
                }
            })
        } else {
            if (message) {
                res.status(404).send(response)
            } else {
                res.status(500).send(response)
            }
        }
    }

    async getAdjuntosPorTipoAdjuntoEvento(req: Request, res: Response) {
        const { idTipoAdjunto, idEvento } = req.params

        const response = await AdjuntoService.getAdjuntosPorTipoAdjuntoEvento(+idTipoAdjunto, +idEvento)

        const { result, error } = response

        if (result) {
            res.status(200).json(response)
        } else {
            if (error) {
                res.status(500).json(response)
            } else {
                res.status(200).json(response);
            }
        }
    }

    async createAdjunto(req: Request, res: Response) {
        const file = req.file

        const { id_evento, titulo } = req.body

        const idEventoParam = id_evento as number

        const tituloParam = titulo as string

        if (!file) {
            res.status(400).json({
                message: 'No se ha proporcionado ningún archivo o el formato es inválido'
            })
            return
        }

        const fileUpload = file as Express.Multer.File

        const response = await AdjuntoService.createAdjunto(fileUpload, idEventoParam, tituloParam);

        const { result, error } = response

        if (result) {
            res.status(200).json(response);
        } else {
            if (error) {
                res.status(500).json(response)
            } else {
                res.status(200).json(response);
            }
        }
    }

    async updateAdjunto(req: Request, res: Response) {
        const { id } = req.params;

        const response = await AdjuntoService.updateAdjunto(+id, req.body);

        const { result, error } = response

        if (result) {
            res.status(200).json(response);
        } else {
            if (error) {
                res.status(500).json(response);
            } else {
                res.status(200).json(response);
            }
        }
    }

    async updateEstado(req: Request, res: Response) {
        const { id } = req.params

        const { estado } = req.body

        if (typeof estado !== 'boolean') {
            res.status(400).json({
                result: false,
                message: 'Tipo de dato incorrecto'
            })
        }

        const response = await AdjuntoService.updateEstado(+id, estado)

        const { result, error } = response

        if (result) {
            res.status(200).json(response)
        } else {
            if (error) {
                res.status(500).json(response)
            } else {
                res.status(200).json(response)
            }
        }
    }

    async deleteAdjunto(req: Request, res: Response) {
        const { id } = req.params;

        const response = await AdjuntoService.deleteAdjunto(+id);

        const { result, error } = response

        if (result) {
            res.status(200).json(response);
        } else {
            if (error) {
                res.status(500).json(response);
            } else {
                res.status(200).json(response);
            }
        }
    }
}

export default new AdjuntoController()