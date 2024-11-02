export interface ITipoContenido {
    id?: number
    nombre?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    estado?: boolean
}

export interface TipoContenidoResponse {
    result?: boolean
    message?: string
    data?: ITipoContenido | ITipoContenido[],
    error?: string
}