import { Request, Response } from 'express'
import PersonaService from '../services/persona.service'
import DocumentoService from '../services/documento.service'
import { ITemporal } from '../interfaces/temporalInterface'
import Temporal from '../models/temporal.models'

class PersonaController {
    async getPersonas(req: Request, res: Response) {
        const response = await PersonaService.getPersonas()

        const { result } = response

        if (result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
        }
    }

    async getPersonaPorId(req: Request, res: Response) {
        const { id } = req.params

        const response = await PersonaService.getPersonaPorId(+id)

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

    async getPersonaPorIdTipoAndNumDoc(req: Request, res: Response) {
        const { idtipodoc, numdoc } = req.params

        const response = await PersonaService.getPersonaPorIdTipoDocAndNumDoc(Number(idtipodoc), numdoc)

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

    async createPersona(req: Request, res: Response) {
        const response = await PersonaService.createPersona(req.body);

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

    async updatePersona(req: Request, res: Response) {
        const { id } = req.params;

        const response = await PersonaService.updatePersona(+id, req.body);

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

    async deletePersona(req: Request, res: Response) {
        const { id } = req.params;

        const response = await PersonaService.deletePersona(+id);

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

    async loadData(req: Request, res: Response) {
        const documentos: { id_tipodocumento: number, numero_documento: string }[] = req.body

        if (!Array.isArray(documentos)) {
            res.status(400).json(
                {
                    result: false,
                    message: 'El parámetro debe ser un arreglo'
                }
            )
        }

        const resultados = []

        for (const doc of documentos) {
            const { id_tipodocumento, numero_documento } = doc

            try {
                const responsePersonaExiste = await PersonaService.getPersonaPorIdTipoDocAndNumDoc(id_tipodocumento, numero_documento)

                if (responsePersonaExiste.result && responsePersonaExiste.data) {
                    resultados.push(
                        {
                            numero_documento,
                            status: "Ya existe"
                        }
                    )
                    continue
                }

                const responsePersonaCreate = await DocumentoService.getDocumentoInfo(id_tipodocumento, numero_documento)

                if (responsePersonaCreate.result) {
                    resultados.push(
                        {
                            numero_documento,
                            status: "Creado"
                        }
                    )
                } else {
                    const dataTemporal: ITemporal = {
                        id_tipodocumento,
                        numero_documento,
                        tabla: 'persona',
                        esInsertado: true
                    }

                    await Temporal.create(dataTemporal as any)

                    resultados.push(
                        {
                            numero_documento,
                            status: "Error al crear. Insertado en temporal"
                        }
                    )
                }
            } catch (error) {
                await Temporal.create(
                    {
                        id_tipodocumento,
                        numero_documento,
                        tabla: 'persona',
                        esInsertado: false
                    }
                )
                resultados.push(
                    {
                        numero_documento,
                        status: "Error inesperado. Insertado en temporal"
                    }
                )
            }
        }
        res.status(200).json(
            {
                result: true,
                data: resultados
            }
        )
    }
}

export default new PersonaController()