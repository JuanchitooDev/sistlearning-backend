export interface ITipoEvento {
    id?: number
    nombre?: string
    nombre_url?: string
    descripcion?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    estado?: boolean
}

export interface TipoEventoResponse {
    result: boolean
    message?: string
    data?: ITipoEvento | ITipoEvento[],
    error?: string
}