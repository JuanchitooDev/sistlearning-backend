import { IEvento } from "./eventoInterface"
import { ITipoContenido } from "./tipoContenidoInterface"

export interface IContenido {
    id?: number
    id_tipocontenido?: number
    id_evento?: number
    titulo?: string
    titulo_url?: string
    descripcion?: string
    url?: string
    es_descargable?: boolean
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    estado?: boolean
    tipoContenido?: ITipoContenido
    evento?: IEvento
}

export interface ContenidoResponse {
    result?: boolean
    message?: string
    data?: IContenido | IContenido[],
    error?: string
}