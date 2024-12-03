import { ITipoEvento } from "./tipoEventoInterface"
import { ICategoriaEvento } from "./categoriaEventoInterface"

export interface IEvento {
    id?: number
    id_parent?: number
    id_tipoevento?: number
    id_categoriaevento?: number
    titulo?: string
    titulo_url?: string
    descripcion?: string
    temario?: string
    plantilla_certificado?: string
    fecha?: Date
    fecha_fin?: string
    modalidad?: string
    precio?: number
    duracion?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    estado?: boolean
    tipoEvento?: ITipoEvento
    categoriaEvento?: ICategoriaEvento
}

export interface EventoResponse {
    result: boolean
    message?: string
    data?: IEvento | IEvento[],
    error?: string
}