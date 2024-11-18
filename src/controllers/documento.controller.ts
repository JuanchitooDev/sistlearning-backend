import { Request, Response } from 'express'
import DocumentoService from '../services/documento.service'

class DocumentoController {
    async getDocumentoInfo(req: Request, res: Response) {
        const { idtipodoc, numdoc } = req.params
        console.log('idtipodoc', idtipodoc, 'numdoc', numdoc)
        const idTipoDocNumber = Number(idtipodoc)
        const response = await DocumentoService.getDocumentoInfo(idTipoDocNumber, numdoc)

        if (response.result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
        }
    }
}

export default new DocumentoController()