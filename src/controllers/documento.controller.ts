import { Request, Response } from 'express'
import DocumentoService from '@/services/documento.service'

class DocumentoController {
    async getDocumentoInfo(req: Request, res: Response) {
        const { idtipodoc, numdoc } = req.params

        const idTipoDocNumber = Number(idtipodoc)

        const response = await DocumentoService.getDocumentoInfo(idTipoDocNumber, numdoc)
        // console.log('response getDocumentoInfo DocumentoController', response)

        const { result, status } = response

        if (result) {
            res.status(200).json(response)
        } else {
            if (status === 500) {
                res.status(500).json(response)
            } else {
                res.status(404).json(response)
            }
            // res.status(500).json(response)
        }
    }
}

export default new DocumentoController()